import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getAccountFunction } from "../functions/account";
import { printAccount } from "../utils/print";

const prisma = new PrismaClient();

export const setInitialCash = async (req: Request, res: Response) => {
  try {
    const { initialCash } = req.body;
    const operator = await prisma.operator.findFirst();

    if (operator?.id) {
      await prisma.operator.delete({ where: { id: operator.id } });
    }
    const operatorLog = await prisma.operator.create({
      data: { initialCash },
    });
    res.status(201).json(operatorLog);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setInitialCash", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };
    console.log(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
export const getInitialCash = async (req: Request, res: Response) => {
  try {
    const { initialCash } = req.body;
    const operator = await prisma.operator.findFirst();

    res.status(201).json(operator);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setInitialCash", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };
    console.log(error);
    const descripcionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};
export const setFinalCash = async (req: Request, res: Response) => {
  try {
    const { finalCash } = req.body.finalCash;
    const operator = await prisma.operator.findFirst();
    const operatorLog = await prisma.operator.upsert({
      create: { finalCash },
      update: { finalCash },
      where: { id: operator?.id },
    });

    res.status(201).json(operatorLog);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setFinalCash", error: JSON.stringify(error) },
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
export const setOperator = async (req: Request, res: Response) => {
  try {
    const { idOperator } = req.body;
    const operator = await prisma.operator.findFirst();
    const operatorLog = await prisma.operator.upsert({
      create: { idOperator },
      update: { idOperator },
      where: { id: operator?.id },
    });

    res.status(201).json(operatorLog);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setOperator", error: JSON.stringify(error) },
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
export const reset = async (req: Request, res: Response) => {
  try {
    await prisma.account.deleteMany();
    await prisma.withdraw.deleteMany();
    await prisma.income.deleteMany();
    res.status(201).json({ messaje: "Registro limpiado" });
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setOperator", error: JSON.stringify(error) },
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
export const lastTicket = async (req: Request, res: Response) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { closed: { not: null } },
      orderBy: { closed: { sort: "desc" } },
    });
    if (accounts[0]) {
      const account = await getAccountFunction(accounts[0]);
      printAccount(account);
      res.status(201).json(account);
    } else {
      res.status(201).json({ message: "No hay tickets" });
    }
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setOperator", error: JSON.stringify(error) },
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
