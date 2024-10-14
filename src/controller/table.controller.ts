import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear una mesa
export const createTable = async (req: Request, res: Response) => {
  try {
    const { name, capacity, details } = req.body;

    const newTable = await prisma.table.create({
      data: {
        name,
        capacity: Number(capacity),
        details,
      },
    });

    res.status(201).json(newTable);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error creando la mesa.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

// Listar todas las mesas
export const listTables = async (req: Request, res: Response) => {
  try {
    const tables = await prisma.table.findMany();
    res.status(200).json(tables);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error listando las mesas.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

// Modificar una mesa
export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capacity, details } = req.body;

    const updatedTable = await prisma.table.update({
      where: { id: Number(id) },
      data: {
        name,
        capacity: Number(capacity),
        details,
      },
    });

    res.status(200).json(updatedTable);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error modificando la mesa.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};

// Eliminar una mesa
export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deletedTable = await prisma.table.delete({
      where: { id: Number(id) },
    });

    res.status(200).json(deletedTable);
  } catch (error) {
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error eliminando la mesa.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};
