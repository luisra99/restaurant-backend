import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Listar todos los Conceptos
export const listConcepts = async (req: Request, res: Response) => {
  try {
    const concepts = await prisma.concept.findMany({
      include: {
        conceptFather: true,
        childConcept: true,
      },
    });

    res.status(200).json(concepts);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "listConcepts", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };

    const descriptionError = {
      message: "Ha ocurrido un error listando los conceptos.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};
