import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  createNewConcept,
  getConceptByDenomination,
  getConceptsByFatherId,
} from "../functions/concepts";

const prisma = new PrismaClient();

export const createConcept = async (req: Request, res: Response) => {
  try {
    const { denomination, details } = req.body;
    const { fatherDenomination } = req.params;

    const { id } = await getConceptByDenomination(fatherDenomination);
    const newConcept = await createNewConcept(id, denomination, details);

    res.status(201).json(newConcept);
  } catch (error: any) {
    const descriptionError = {
      message: "Ha ocurrido un error creando el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};
export const getConcepts = async (req: Request, res: Response) => {
  try {
    const { fatherDenomination } = req.params;
    const { id } = await getConceptByDenomination(fatherDenomination);
    const conceptos = await getConceptsByFatherId(id);

    res.status(200).json(conceptos);
  } catch (error: any) {
    const descriptionError = {
      message: error.message || "Ha ocurrido un error listando los conceptos.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};

export const getConceptById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const concepto = await prisma.concept.findFirst({
      where: { id: id },
    });

    res.status(200).json(concepto);
  } catch (error: any) {
    const descriptionError = {
      message: "Ha ocurrido un error obtiendo el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};
// Modificar Concepto
export const updateConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { denomination, details, fatherId } = req.body;

    const updatedConcept = await prisma.concept.update({
      where: { id: id },
      data: {
        denomination,
        details,
        fatherId,
      },
    });

    res.status(200).json(updatedConcept);
  } catch (error: any) {
    const descriptionError = {
      message: "Ha ocurrido un error modificando el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};

export const deleteConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedConcept = await prisma.concept.delete({
      where: { id: id },
    });

    res.status(200).json(deletedConcept);
  } catch (error: any) {
    const descriptionError = {
      message: "Ha ocurrido un error eliminando el concepto.",
      code: error.code || "SERVER_ERROR",
      stackTrace: error.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descriptionError);
  }
};
