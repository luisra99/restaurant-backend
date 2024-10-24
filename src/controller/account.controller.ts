import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAccountFunction } from "../functions/account";
const prisma = new PrismaClient();

// Abrir cuenta
export const openAccount = async (req: Request, res: Response) => {
  try {
    const { name, description, people, idDependent, idTable, idType, details } =
      req.body;
    const accountDefaultConcept = await prisma.concept.findFirst({
      where: { denomination: "Cuenta local" },
    });
    const activeTaxDiscounts = await prisma.taxDiscounts.findMany({
      where: {
        status: true,
      },
    });
    const openAccountsTables = await prisma.table.findMany({
      where: {
        id: Number(idTable),
        Account: { some: { closed: { equals: null } } },
      },
      include: { Account: true },
    });
    if (openAccountsTables.length > 0) {
      res.status(200).json({ messaje: "La mesa esta ocupada" });
    } else {
      if (idType || accountDefaultConcept) {
      }
      const newAccount = await prisma.account.create({
        data: {
          name,
          people,
          description,
          idDependent,
          idTable,
          idType: idType ? Number(idType) : accountDefaultConcept?.id ?? 0,
          taxDiscount: activeTaxDiscounts.map((tax) => tax.id),
        },
      });
      res.status(201).json(newAccount);
    }
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "openAccount", error: JSON.stringify(error) },
    });
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
    prisma.errorLogs.create({
      data: { info: "modifyAccountDetails", error: JSON.stringify(error) },
    });
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
    prisma.errorLogs.create({
      data: { info: "modifyAccount", error: JSON.stringify(error) },
    });
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
    prisma.errorLogs.create({
      data: { info: "deleteAccountDetails", error: JSON.stringify(error) },
    });
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
    const account = await getAccountFunction(req.params);
    res.status(200).json(account);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getAccount", error: JSON.stringify(error) },
    });
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
      where: { active: true, closed: { equals: null } },
      include: {
        table: true,
      },
    });

    res.status(200).json(accounts);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "listAccounts", error: JSON.stringify(error) },
    });
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
    prisma.errorLogs.create({
      data: { info: "deleteAccount", error: JSON.stringify(error) },
    });
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
    prisma.errorLogs.create({
      data: { info: "findConceptsByFather", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error buscando los conceptos por padre.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
// Eliminar Concepto
export const closeAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await getAccountFunction(req.params);

    const closeAccount = await prisma.account.update({
      where: { id: Number(id) },
      data: { closed: new Date() },
    });
    const change = account.finalPrice - account.totalPaid;
    if (change < 0) {
      const conceptoCambio = await prisma.concept.findFirst({
        where: { denomination: "Cambio" },
      });
      if (conceptoCambio?.id) {
        const withdraw = await prisma.withdraw.create({
          data: { amount: Number(change * -1), idConcepto: conceptoCambio.id },
        });
      }
    }

    res.status(200).json(closeAccount);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "closeAccount", error: JSON.stringify(error) },
    });
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
