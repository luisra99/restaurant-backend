import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAllAccountsFunction } from "../functions/account";

const prisma = new PrismaClient();

// Estadisticas de productos por area
export const operatorInform = async (req: Request, res: Response) => {
  try {
    let propina = 0;
    //#region De la cuenta
    let ventaBruta = 0;
    let impuestos: any = {};
    let descuentos: any = {};
    const cuentas = await getAllAccountsFunction();
    cuentas.forEach((cuenta) => {
      ventaBruta += cuenta.totalPrice;

      cuenta.mappedTaxsDiscounts.map((taxDiscount: any) => {
        if (taxDiscount.tax) {
          impuestos[taxDiscount.name] =
            (impuestos[taxDiscount.name] ?? 0) + taxDiscount.amount;
        } else {
          descuentos[taxDiscount.name] =
            (descuentos[taxDiscount.name] ?? 0) + taxDiscount.amount;
        }
      });
    });
    //#endregion
    //#region De los pagos
    let efectivo: any = {};
    let transferencia: any = {};
    let extracciones: any = {};
    const cashPayments = await prisma.payment.findMany({
      include: { divisa: true },
      where: { type: { denomination: { equals: "Efectivo" } } },
    });
    const transferPayments = await prisma.payment.findMany({
      include: { divisa: true },
      where: { type: { denomination: { equals: "Transferencia" } } },
    });
    const withdraws = await prisma.withdraw.findMany({
      include: { concept: true },
    });

    console.log("Cash", cashPayments);
    console.log("Transfer", transferPayments);
    cashPayments.map((payment) => {
      console.log(payment.divisa?.denomination);
      efectivo[payment.divisa?.denomination ?? "CUP"] =
        (efectivo[payment.divisa?.denomination ?? "CUP"] ?? 0) +
        Number(payment.amount);
    });
    transferPayments.map((payment) => {
      transferencia[payment.divisa?.denomination ?? "CUP"] =
        (transferencia[payment.divisa?.denomination ?? "CUP"] ?? 0) +
        Number(payment.amount);
    });
    withdraws.map((withdraw) => {
      extracciones[withdraw.concept.denomination] =
        (transferencia[withdraw.concept.denomination] ?? 0) +
        Number(withdraw.amount);
    });
    //#endregion
    //#region Calculado en caja
    //#endregion

    res
      .status(201)
      .json({
        ventaBruta,
        impuestos,
        descuentos,
        efectivo,
        transferencia,
        extracciones,
      });
  } catch (error) {
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
