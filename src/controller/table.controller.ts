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
        capacity: capacity,
        details,
      },
    });

    res.status(201).json(newTable);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "createTable", error: JSON.stringify(error) },
    });
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
    const tables = await prisma.table.findMany({
      include: {
        Account: {
          include: {
            details: {
              include: {
                offer: true,
              },
            },
            dependent: true,
            _count: true,
          },
          where: { closed: { equals: null } },
        },
      },
      orderBy: { details: "asc" },
    });
    const response = tables.map((table) => {
      let amount = 0;

      // Si la mesa tiene una cuenta asociada
      if (table.Account[0]) {
        // Iterar sobre los detalles de la cuenta para calcular el total
        amount = table.Account?.[0].details.reduce((total, detail) => {
          return total + detail.offer.price.toNumber() * detail.quantity;
        }, 0);
      }

      // Retornar la mesa con el total calculado

      return {
        ...table,
        Account: table.Account[0],
        amount, // Total calculado para esta mesa
      };
    });
    res.status(200).json(response);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "listTables", error: JSON.stringify(error) },
    });
    console.log(error);
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error listando las mesas.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};
// Listar todas las mesas
export const getTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const table = await prisma.table.findUnique({
      where: {
        id: id,
      },
    });

    if (!table) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }

    res.status(200).json(table);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getTable", error: JSON.stringify(error) },
    });
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
      where: { id: id },
      data: {
        name,
        capacity: capacity,
        details,
      },
    });

    res.status(200).json(updatedTable);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "updateTable", error: JSON.stringify(error) },
    });
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
      where: { id: id },
    });

    res.status(200).json(deletedTable);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "deleteTable", error: JSON.stringify(error) },
    });
    const err = error as Error & { code?: string };
    const descripcionError = {
      message: "Error eliminando la mesa.",
      code: err.code || "SERVER_ERROR",
      stackTrace: err.stack || "NO_STACK_TRACE_AVAILABLE",
    };
    res.status(500).json(descripcionError);
  }
};
