import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear Concepto
export const createConcept = async (req: Request, res: Response) => {
  try {
    const { denomination, details, fatherId } = req.body;

    const newConcept = await prisma.concept.create({
      data: {
        denomination,
        details,
        fatherId,
      },
    });

    res.status(201).json(newConcept);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "createConcept", error: JSON.stringify(error) },
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

    const descripcionError = {
      message: "Ha ocurrido un error listando los conceptos.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Obtener un concepto

export const getConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const concept = await prisma.concept.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!concept) {
      return res.status(404).json({ message: "Concepto no encontrado" });
    }

    res.status(200).json(concept);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getConcept", error: JSON.stringify(error) },
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
export const getConceptByDenomination = async (req: Request, res: Response) => {
  try {
    const { fatherDenomination } = req.body;

    // Buscar el concepto cuyo fatherId tenga la denominación especificada
    const fatherConcept = await prisma.concept.findFirst({
      where: {
        denomination: String(fatherDenomination),
      },
    });

    if (!fatherConcept) {
      return res.status(404).json({ message: "Concepto padre no encontrado" });
    }

    // Buscar los conceptos que tienen ese fatherId
    const childConcepts = await prisma.concept.findMany({
      where: {
        fatherId: fatherConcept.id,
      },
    });

    if (childConcepts.length === 0) {
      return res.status(404).json({
        message: "No se encontraron conceptos hijos para el padre especificado",
      });
    }

    res.status(200).json(childConcepts);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getConceptByDenomination", error: JSON.stringify(error) },
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

// Modificar Concepto
export const updateConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { denomination, details, fatherId } = req.body;

    const updatedConcept = await prisma.concept.update({
      where: { id: Number(id) },
      data: {
        denomination,
        details,
        fatherId,
      },
    });

    res.status(200).json(updatedConcept);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "updateConcept", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };

    const descripcionError = {
      message: "Ha ocurrido un error modificando el concepto.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };

    res.status(500).json(descripcionError);
  }
};

// Eliminar Concepto
export const deleteConcept = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedConcept = await prisma.concept.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedConcept);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "deleteConcept", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };

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
      data: { info: "findConceptByFather", error: JSON.stringify(error) },
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
