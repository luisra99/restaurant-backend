import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getDivisas } from "./divisa.controller";

const prisma = new PrismaClient();

// Abrir cuenta
export const openAccount = async (req: Request, res: Response) => {
  try {
    const { name, description, people, idDependent, idTable, idType, details } =
      req.body;

    const activeTaxDiscounts = await prisma.taxDiscounts.findMany({
      where: {
        status: true,
      },
    });

    const newAccount = await prisma.account.create({
      data: {
        name,
        people,
        description,
        idDependent,
        idTable,
        idType: idType ? Number(idType) : undefined,
        taxDiscount: activeTaxDiscounts.map((tax) => tax.id),
      },
    });

    res.status(201).json(newAccount);
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Modificar pedidos de la cuenta
export const modifyAccountDetails = async (req: Request, res: Response) => {
  try {
    const { idAccount, idOffer, quantity, negative } = req.body;
    let response;
    let detail = await prisma.accountDetails.findFirst({
      where: { idAccount, idOffer },
    });
    if (detail) {
      detail.quantity = negative
        ? detail.quantity - quantity
        : detail.quantity + quantity;

      response =
        detail.quantity !== 0
          ? await prisma.accountDetails.update({
              where: { id: detail.id },
              data: detail,
            })
          : await prisma.accountDetails.delete({ where: { id: detail.id } });
    } else {
      if (quantity != 0)
        response = await prisma.accountDetails.create({
          data: { idAccount, idOffer, quantity },
        });
    }
    res.status(201).json(response);
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Modificar pedidos de la cuenta
export const modifyAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.update({
      where: { id: Number(id) },
      data: { ...req.body, idType: Number(req.body.idType) },
    });
    res.status(201).json(account);
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Eliminar pedidos de la cuenta
export const deleteAccountDetails = async (req: Request, res: Response) => {
  try {
    const { idAccount, idOffer } = req.params;
    let response = await prisma.accountDetails.deleteMany({
      where: {
        idAccount: Number(idAccount),
        idOffer: Number(idOffer),
      },
    });

    res.status(201).json(response);
  } catch (error) {
    const err = error as Error & { code?: string };
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Obtener cuenta
export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: { id: Number(id) },
      include: {
        table: true,
        details: { include: { offer: true } },
        type: true,
        dependent: true,
      },
    });

    // Obtener todos los pagos de la cuenta
    const payments = await prisma.payment.findMany({
      where: { idAccount: Number(id) },
    });

    // Sumar los montos de los pagos
    const totalPaid = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    const orders = account?.details.map((detail) => {
      return {
        id: detail.offer.id,
        name: detail.offer.name,
        quantity: detail.quantity,
        totalPrice: detail.quantity * Number(detail.offer.price), // Multiplica cantidad por precio
      };
    });

    const divisas = await getDivisas();

    // Calcular el total de todas las cantidades
    const totalQuantity = orders?.reduce(
      (sum, order) => sum + order.quantity,
      0
    );

    // Calcular el precio total de todas las ofertas
    const totalPrice =
      orders?.reduce((sum, order) => sum + order.totalPrice, 0) ?? 0;

    const taxsDiscounts = account?.taxDiscount.length
      ? await prisma.taxDiscounts.findMany({
          where: {
            id: { in: account.taxDiscount },
          },
        })
      : [];

    // Calcular el precio final basado en los impuestos y descuentos
    let finalPrice: number = totalPrice;
    const mappedTaxsDiscounts = taxsDiscounts.map((item: any) => {
      const amount = (item.percent / 100) * totalPrice;

      // Si es impuesto, lo sumamos al precio final
      if (item.tax) {
        finalPrice += amount;
      } else {
        // Si es descuento, lo restamos del precio final
        finalPrice -= amount;
      }

      // Devolvemos el objeto con el monto calculado
      return {
        ...item,
        amount, // Monto calculado basado en el percent
      };
    });

    const divisaAmount = divisas?.map((divisa: any) => {
      return {
        denomination: divisa.denomination,
        amount: (
          finalPrice / Number(parseFloat(divisa.details).toFixed(2))
        ).toFixed(2),
      };
    });

    // Enviar la respuesta incluyendo el total pagado
    res.status(200).json({
      ...account,
      mappedTaxsDiscounts,
      orders,
      totalQuantity,
      totalPrice,
      finalPrice,
      divisaAmount,
      dependent: account?.dependent?.name,
      totalPaid, // Nuevo campo que indica cuánto se ha pagado
    });
  } catch (error) {
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error listando los conceptos.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Listar todas las cuentas
export const listAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { active: true },
      include: {
        table: true,
      },
    });

    res.status(200).json(accounts);
  } catch (error) {
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error listando los conceptos.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Eliminar Concepto
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedConcept = await prisma.account.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedConcept);
  } catch (error) {
    const err = error as Error & { code?: string };
    console.log(error);
    const descripcionError = {
      message: "Ha ocurrido un error eliminando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Buscar conceptos por su padre (opcionalmente incluir los hijos)
export const findConceptsByFather = async (req: Request, res: Response) => {
  try {
    const { fatherId } = req.params;
    const { includeChildren } = req.query;

    const concepts = await prisma.concept.findMany({
      where: { fatherId: Number(fatherId) },
      include: {
        childConcept: includeChildren === "true", // Incluir hijos solo si includeChildren es 'true'
      },
    });

    res.status(200).json(concepts);
  } catch (error) {
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error buscando los conceptos por padre.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
