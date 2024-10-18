import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Obtener el concepto padre "Divisas"
async function getDivisasParentConcept() {
  return await prisma.concept.findFirst({
    where: { denomination: "Divisas" },
  });
}

// Listar todas las divisas (children de Divisas)
export const listDivisas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const divisasParent = await getDivisasParentConcept();
    if (!divisasParent) {
      res.status(404).json({ message: 'Concepto "Divisas" no encontrado.' });
      return;
    }

    const divisas = await prisma.concept.findMany({
      where: { fatherId: divisasParent.id },
    });

    res.status(200).json(divisas);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener una divisa específica por su ID
export const getDivisaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const divisa = await prisma.concept.findUnique({
      where: { id: Number(id) },
    });

    if (!divisa) {
      res.status(404).json({ message: "Divisa no encontrada." });
      return;
    }

    res.status(200).json(divisa);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Crear una nueva divisa
export const createDivisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { denomination, details } = req.body;

    // Verificar que el concepto padre "Divisas" exista
    const divisasParent = await getDivisasParentConcept();
    if (!divisasParent) {
      res.status(404).json({ message: 'Concepto "Divisas" no encontrado.' });
      return;
    }

    // Crear nueva divisa
    const newDivisa = await prisma.concept.create({
      data: {
        denomination,
        details: String(details), // Almacenar el porcentaje de conversión como string (decimales)
        fatherId: divisasParent.id,
      },
    });

    res.status(201).json(newDivisa);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Actualizar una divisa existente
export const updateDivisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { denomination, details } = req.body;

    const updatedDivisa = await prisma.concept.update({
      where: { id: Number(id) },
      data: {
        denomination,
        details: String(details), // Actualizamos el campo details
      },
    });

    res.status(200).json(updatedDivisa);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Eliminar una divisa
export const deleteDivisa = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.concept.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "Divisa eliminada correctamente." });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
