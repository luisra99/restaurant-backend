import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setInitialCash = async (req: Request, res: Response) => {
  try {
    const { initialCash } = req.body.initialCash;
    const operator = await prisma.operator.findFirst();
    const operatorLog = await prisma.operator.upsert({
      create: { initialCash },
      update: { initialCash },
      where: { id: operator?.id },
    });

    res.status(201).json(operatorLog);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "setInitialCash", error: JSON.stringify(error) },
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
    const { idOperator } = req.body.finalCash;
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
