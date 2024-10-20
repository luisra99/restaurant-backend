import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Estadisticas de productos por area
export const areaStatistic = async (req: Request, res: Response) => {
  try {
   const resume=await prisma.accountDetails.findMany({include:{offer:{select:{idArea:true}}}})
    res.status(201).json(resume);
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
