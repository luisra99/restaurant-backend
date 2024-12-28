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
import { print } from "../libs/escpos";
import { xmlValePorArea } from "../utils/escpos.templates";
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
    const descriptionError = {
      message: error.message || "Ha ocurrido un error creando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descriptionError);
  }
};

// Modificar pedidos de la cuenta
export const modifyAccountDetails = async (req: Request, res: Response) => {
  try {
    const { idAccount, idOffer, quantity, negative } = req.body;
    let response;
    let modifiedOrderDetails;
    let detail = await getOrderAccountDetails({ ...req.body, marched: false });

    if (detail) {
      modifiedOrderDetails = modifyOrderDetail({ detail, ...req.body });
      response =
        modifiedOrderDetails.quantity > 0
          ? await updateOrderDetail(modifiedOrderDetails)
          : await deleteOrderDetail(modifiedOrderDetails);
    } else {
      if (quantity > 0) {
        if (negative) {
          let detail = await getOrderAccountDetails({
            ...req.body,
            marched: true,
          });
          modifiedOrderDetails = modifyOrderDetail({ detail, ...req.body });
          response =
            modifiedOrderDetails.quantity > 0
              ? await updateOrderDetail(modifiedOrderDetails)
              : await deleteOrderDetail(modifiedOrderDetails);
        } else {
          response = await createOrderDetail({ idAccount, idOffer, quantity });
        }
      }
    }
    const account = await getAccountFunction({ id: idAccount });
    res.status(201).json(account);
  } catch (error: any) {
    console.error(error);
    const descriptionError = {
      message: error.message ?? "Ha ocurrido un error modificando la orden.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};

export const marchOrders = async (req: Request, res: Response) => {
  try {
    const { idAccount } = req.params;
    const unmarchedOrders = await prisma.accountDetails.findMany({
      where: { idAccount, marchado: null },
      include: { offer: { include: { area: true } } },
    });

    function groupByAreaDenomination(details: any[]) {
      return details.reduce((acc, detail) => {
        const areaDenomination = detail.offer.area.denomination;

        if (!acc[areaDenomination]) {
          // Inicializar el grupo si no existe
          acc[areaDenomination] = [];
        }

        // Agregar el detalle al grupo correspondiente
        acc[areaDenomination].push({
          id: detail.offer.id,
          name: detail.offer.name,
          quantity: detail.quantity,
          totalPrice: detail.quantity * Number(detail.offer.price),
        });

        return acc;
      }, {} as Record<string, { id: string; name: string; quantity: number; totalPrice: number }[]>);
    }
    const march = await prisma.accountDetails.updateMany({
      where: { idAccount, marchado: null },
      data: { marchado: new Date(Date.now()) },
    });

    const areaGrouped = groupByAreaDenomination(unmarchedOrders);
    console.log(Object.keys(areaGrouped));
    const areas = Object.keys(areaGrouped);
    areas.map((area: string) => {
      printOrderForArea(area, areaGrouped[area]);
    });

    res.status(201).json(groupByAreaDenomination(unmarchedOrders));
  } catch (error: any) {
    console.error(error);
    const descriptionError = {
      message: error.message ?? "Ha ocurrido un error modificando la orden.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: "Ha ocurrido un error modificando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: error.message || "No se pudo eliminar la orden",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};

export const getAccount = async (req: Request, res: Response) => {
  try {
    const account = await getAccountFunction({ ...req.params, distinct: true });
    res.status(200).json(account);
  } catch (error: any) {
    const descriptionError = {
      message:
        error.message ||
        "Ha ocurrido un error obteniendo la información de la cuenta",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: "Ha ocurrido un error eliminando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: "Ha ocurrido un error obteniendo las cuentas.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: error.message || "Ha ocurrido un error cerrando la cuenta.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descriptionError);
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
    const descriptionError = {
      message: "Ha ocurrido un error modificando los impuestos y descuentos.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};
function printOrderForArea(area: string, orders: any) {
  print({ area, orders }, xmlValePorArea);
}
