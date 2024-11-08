import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAllAccountsFunction } from "../functions/account";
import { print } from "../libs/escpos";
import { xmlEstadoCaja } from "../utils/escpos.templates";

const prisma = new PrismaClient();

// Estadisticas de productos por area
export const operatorInform = async (req: Request, res: Response) => {
  try {
    let propina = 0;
    //#region De la cuenta
    let ingresoTotal = 0;
    let ventaBruta = 0;
    let impuestos: any = {};
    let descuentos: any = {};
    const cuentas = await getAllAccountsFunction();
    cuentas.forEach((cuenta) => {
      ventaBruta += cuenta.totalPrice;
      cuenta.mappedTaxsDiscounts.map((taxDiscount: any) => {
        if (taxDiscount.tax) {
          impuestos[`${taxDiscount.name} (${taxDiscount.percent}%)`] =
            (impuestos[`${taxDiscount.name} (${taxDiscount.percent}%)`] ?? 0) +
            taxDiscount.amount;
        } else {
          descuentos[`${taxDiscount.name} (${taxDiscount.percent}%)`] =
            (descuentos[`${taxDiscount.name} (${taxDiscount.percent}%)`] ?? 0) +
            taxDiscount.amount;
        }
      });
    });
    //#endregion
    //#region De los pagos
    let efectivo: any = {};
    let transferencia: any = {};
    let extracciones: any = {};
    const payments = await prisma.payment.findMany({
      include: { divisa: true },
    });
    const withdraws = await prisma.withdraw.findMany();
    const cashPayments = await prisma.payment.findMany({
      include: { divisa: true },
      where: { type: { denomination: { equals: "Efectivo" } } },
    });
    const transferPayments = await prisma.payment.findMany({
      include: { divisa: true },
      where: { type: { denomination: { equals: "Transferencia" } } },
    });

    const income = await prisma.income.findMany({
      include: { concept: true },
    });
    payments.map((payment) => {
      ingresoTotal += Number(payment.amount);
    });
    cashPayments.map((payment) => {
      efectivo["CUP"] = (efectivo["CUP"] ?? 0) + payment.amount;
    });
    transferPayments.map((payment) => {
      transferencia[payment.divisa?.denomination ?? "CUP"] =
        (transferencia[payment.divisa?.denomination ?? "CUP"] ?? 0) +
        Number(payment.amount) /
          (payment.divisa?.details ? Number(payment.divisa?.details) : 1);
    });
    withdraws.map((withdraw) => {
      ingresoTotal -= Number(withdraw.amount);
      extracciones["CUP"] =
        (extracciones["CUP"] ?? 0) + Number(withdraw.amount);
    });
    income.map((_propina) => {
      propina += Number(_propina.amount);
    });
    const { initialCash } = (await prisma.operator.findFirst()) ?? {};
    //#endregion
    //#region Calculado en caja
    //#endregion
    ingresoTotal += propina;
    efectivo.CUP =
      (efectivo.CUP ?? 0) -
      (extracciones["CUP"] ?? 0) +
      Number(initialCash ?? 0) +
      propina;
    const xml = print(
      {
        ventaBruta,
        ingresoTotal,
        initialCash: initialCash ?? 0,
        propina,
        impuestos,
        descuentos,
        efectivo,
        transferencia,
        extracciones,
        balance: ingresoTotal + Number(initialCash ?? 0),
      },
      xmlEstadoCaja
    );

    res.status(201).send(xml);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "operatorInform", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
