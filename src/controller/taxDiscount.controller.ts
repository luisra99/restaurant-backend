import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Listar todos los TaxDiscounts
export const listTaxDiscounts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taxDiscounts = await prisma.taxDiscounts.findMany();
    res.status(200).json(taxDiscounts);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "listTaxDiscounts", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Obtener un TaxDiscount por ID
export const getTaxDiscountById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const taxDiscount = await prisma.taxDiscounts.findUnique({
      where: { id: id },
    });

    if (!taxDiscount) {
      res.status(404).json({ message: "Tax/Discount no encontrado." });
      return;
    }

    res.status(200).json(taxDiscount);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getTaxDiscountById", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};
// Obtener un TaxDiscount por ID
export const alterTaxDiscount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const taxDiscount = await prisma.taxDiscounts.findUnique({
      where: { id: id },
    });
    const updatedTaxDiscount = await prisma.taxDiscounts.update({
      where: { id: id },
      data: {
        ...taxDiscount,
        status: !taxDiscount?.status,
      },
    });

    if (!updatedTaxDiscount) {
      res.status(404).json({ message: "Tax/Discount no encontrado." });
      return;
    }

    res.status(200).json(taxDiscount);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "alterTaxDiscount", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Crear un nuevo TaxDiscount
export const createTaxDiscount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, percent, tax } = req.body;

    if (!name || percent === undefined || tax === undefined) {
      res
        .status(400)
        .json({ message: "Los campos name, percent y tax son obligatorios." });
      return;
    }

    const newTaxDiscount = await prisma.taxDiscounts.create({
      data: {
        name,
        percent: percent, // Asegurar que el porcentaje sea un número
        tax: Boolean(tax), // Asegurar que tax sea un valor booleano
      },
    });

    res.status(201).json(newTaxDiscount);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "createTaxDiscount", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Actualizar un TaxDiscount
export const updateTaxDiscount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, percent, tax } = req.body;

    if (!name || percent === undefined || tax === undefined) {
      res
        .status(400)
        .json({ message: "Los campos name, percent y tax son obligatorios." });
      return;
    }

    const updatedTaxDiscount = await prisma.taxDiscounts.update({
      where: { id: id },
      data: {
        name,
        percent: percent,
        tax: Boolean(tax), // Asegurar que tax sea un valor booleano
      },
    });

    res.status(200).json(updatedTaxDiscount);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "updateTaxDiscount", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};

// Eliminar un TaxDiscount
export const deleteTaxDiscount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.taxDiscounts.delete({
      where: { id: id },
    });

    res.status(200).json({ message: "Tax/Discount eliminado correctamente." });
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "deleteTaxDiscount", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: (error as Error).message });
  }
};
