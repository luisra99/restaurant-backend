import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  closeThisAccount,
  getAccountFunction,
  getActiveDiscounts,
} from "../functions/account";
import {
  createOrderDetail,
  deleteOrderDetail,
  getOrderAccountDetails,
  modifyOrderDetail,
  updateOrderDetail,
} from "../functions/orderDetails";
import {
  getAccountDefaultConcept,
  getChangeConcept,
} from "../functions/concepts";
import { saveMovement } from "../functions/incomesOutcomes";
const prisma = new PrismaClient();

// Abrir cuenta
export const openAccount = async (req: Request, res: Response) => {
  try {
    const { name, description, people, idDependent, idTable, idType } =
      req.body;

    const accountDefaultConcept = await getAccountDefaultConcept();
    const activeTaxDiscounts = await getActiveDiscounts();
    const _idType = idType ? idType : accountDefaultConcept?.id ?? 0;

    const newAccount = await prisma.account.create({
      data: {
        name,
        people,
        description,
        idDependent,
        idTable,
        idType: _idType,
        taxDiscount: activeTaxDiscounts,
      },
    });
    res.status(201).json(newAccount);
  } catch (error: any) {
    const descripcionError = {
      message: error.message || "Ha ocurrido un error creando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

// Modificar pedidos de la cuenta
export const modifyAccountDetails = async (req: Request, res: Response) => {
  try {
    const { idAccount, idOffer, quantity, negative } = req.body;
    let response;
    let detail = await getOrderAccountDetails(req.body);

    if (detail) {
      const modifiedOrderDetails = modifyOrderDetail({ detail, ...req.body });
      response =
        modifiedOrderDetails.quantity !== 0
          ? await updateOrderDetail(modifiedOrderDetails)
          : await deleteOrderDetail(modifiedOrderDetails);
    } else {
      if (quantity != 0)
        response = await createOrderDetail({ idAccount, idOffer, quantity });
    }
    const account = await getAccountFunction({ id: idAccount });
    res.status(201).json(account);
  } catch (error: any) {
    console.error(error);
    const descripcionError = {
      message: error.message ?? "Ha ocurrido un error modificando la orden.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

export const modifyAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await prisma.account.update({
      where: { id: id },
      data: { ...req.body, idType: req.body.idType },
    });
    const modifiedAccount = await getAccountFunction(req.params);
    res.status(201).json(modifiedAccount);
  } catch (error: any) {
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error modificando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

export const deleteAccountDetails = async (req: Request, res: Response) => {
  try {
    const { idAccount, idOffer } = req.params;
    let response = await prisma.accountDetails.deleteMany({
      where: {
        idAccount: idAccount,
        idOffer: idOffer,
      },
    });
    const account = await getAccountFunction({ id: idAccount });

    res.status(201).json(account);
  } catch (error: any) {
    console.error(error);
    const descripcionError = {
      message: error.message || "No se pudo eliminar la orden",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const account = await getAccountFunction(req.params);
    res.status(200).json(account);
  } catch (error: any) {
    const descripcionError = {
      message:
        error.message ||
        "Ha ocurrido un error obteniendo la información de la cuenta",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedConcept = await prisma.account.delete({
      where: { id: id },
    });

    res.status(200).json(deletedConcept);
  } catch (error: any) {
    console.log(error);
    const descripcionError = {
      message: "Ha ocurrido un error eliminando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

export const listAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { active: true, closed: { equals: null } },
      include: {
        table: true,
      },
    });

    res.status(200).json(accounts);
  } catch (error: any) {
    const descripcionError = {
      message: "Ha ocurrido un error obteniendo las cuentas.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

export const closeAccount = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const account = await getAccountFunction(req.params);
    console.log(account);
    const change = account.finalPrice - account.totalPaid;
    if (change > 0 && account.type?.denomination !== "Cuenta Casa") {
      throw new Error("La cuenta no se ha pagado completamente");
    } else {
      if (change < 0) {
        const { id } = await getChangeConcept();
        await saveMovement({ amount: change, idConcepto: id });
      }
      await closeThisAccount(id);
    }
    res.status(200).json({ message: "Cuenta cerrada" });
  } catch (error: any) {
    console.log(error);
    const descripcionError = {
      message: error.message || "Ha ocurrido un error cerrando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

export const modifyTaxes = async (req: Request, res: Response) => {
  try {
    const { idTaxDiscounts, idAccount } = req.body;
    const { id } = await prisma.account.update({
      where: { id: idAccount },
      data: { taxDiscount: idTaxDiscounts },
    });
    const updatedAccount = await getAccountFunction({ id });
    res.status(201).json(updatedAccount);
  } catch (error: any) {
    console.error(error);
    const descripcionError = {
      message: "Ha ocurrido un error modificando los impuestos y descuentos.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
