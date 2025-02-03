import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, areaId, quantity } = req.body
    const updatedStock = await prisma.stock.update({ where: { itemId_areaId: { itemId, areaId } }, data: { quantity: Number(quantity) } })

    res.status(201).json({ message: "Producto actualizado" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "No se pudo actualizar el producto" })
  }
}