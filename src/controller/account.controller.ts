import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Abrir cuenta
export const openAccount = async (req: Request, res: Response) => {
  try {
    const { name, description, people, idDependent, idTable, details } =
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
// Listar todos los Conceptos
export const getAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: { id: Number(id) },
      include: {
        table: true,
        details: { include: { offer: true } },
        type: true,
      },
    });
    const orders = account?.details.map((detail) => {
      return {
        id: detail.offer.id,
        name: detail.offer.name,
        quantity: detail.quantity,
        totalPrice: detail.quantity * Number(detail.offer.price), // Multiplica cantidad por precio
      };
    });
    // Calcular el total de todas las cantidades
    const totalQuantity = orders?.reduce(
      (sum, order) => sum + order.quantity,
      0
    );
    // Calcular el total de todas las cantidades
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
    let finalPrice = totalPrice;
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
    res.status(200).json({
      ...account,
      mappedTaxsDiscounts,
      orders,
      totalQuantity,
      totalPrice,
      finalPrice,
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

// Obtener un concepto

export const getConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const concept = await prisma.concept.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!concept) {
      return res.status(404).json({ message: "Concepto no encontrado" });
    }

    res.status(200).json(concept);
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

// Modificar Concepto
export const updateConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { denomination, details, fatherId } = req.body;

    const updatedConcept = await prisma.concept.update({
      where: { id: Number(id) },
      data: {
        denomination,
        details,
        fatherId,
      },
    });

    res.status(200).json(updatedConcept);
  } catch (error) {
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error modificando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Eliminar Concepto
export const deleteConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedConcept = await prisma.concept.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedConcept);
  } catch (error) {
    const err = error as Error & { code?: string };

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
