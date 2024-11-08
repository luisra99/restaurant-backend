import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todos los dependientes
export const listDependents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dependents = await prisma.dependent.findMany();
    res.status(200).json(dependents);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "listDependents", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener un dependiente por ID
export const getDependentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const dependent = await prisma.dependent.findUnique({
      where: { id: id },
    });

    if (!dependent) {
      res.status(404).json({ message: "Dependiente no encontrado." });
      return;
    }

    res.status(200).json(dependent);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getDependentById", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Crear un nuevo dependiente
export const createDependent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "El nombre es obligatorio." });
      return;
    }

    const newDependent = await prisma.dependent.create({
      data: {
        name,
      },
    });

    res.status(201).json(newDependent);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "createDependent", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Actualizar un dependiente
export const updateDependent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: "El nombre es obligatorio." });
      return;
    }

    const updatedDependent = await prisma.dependent.update({
      where: { id: id },
      data: {
        name,
      },
    });

    res.status(200).json(updatedDependent);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "updateDependent", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Eliminar un dependiente
export const deleteDependent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.dependent.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Dependiente eliminado correctamente." });
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "deleteDependent", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};
