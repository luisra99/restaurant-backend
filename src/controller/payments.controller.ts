import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { calcDivisaConversionRateAmount } from "../utils/calc"
const prisma = new PrismaClient();

// Endpoint para registrar un nuevo pago
// router.post("/payments", async (req, res) => {
export const pay = async (req: Request, res: Response) => {
  let { idAccount, idMethod, amount, idDivisa } = req.body;

  try {
    // Si se proporciona idDivisa, buscar el concepto correspondiente
    if (idDivisa) {

      amount = await calcDivisaConversionRateAmount(idDivisa, amount);

    }
    let data: any = {
      idAccount: idAccount,
      idMethod: idMethod,
      amount,
    };
    if (idDivisa) data.idDivisa = idDivisa;

    // Crear el pago
    const payment = await prisma.payment.create({
      data,
    });

    res.status(201).json(payment);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "pay", error: JSON.stringify(error) },
    });
    console.log(error);
    res.status(500).json({ error: "Error al registrar el pago." });
  }
};

// Endpoint para obtener todos los pagos de una cuenta específica
// router.get("/accounts/:accountId/payments", async (req, res) => {
export const getPayments = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        idAccount: accountId,
      }, orderBy: { date: "desc" }
    });
    res.json(payments);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "getPayments", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: "Error al obtener los pagos." });
  }
};

// Endpoint para descartar (eliminar) todos los pagos de una cuenta
// router.delete("/accounts/:accountId/payments", async (req, res) => {
export const deletePayments = async (req: Request, res: Response) => {
  const { accountId } = req.params;

  try {
    await prisma.payment.deleteMany({
      where: {
        idAccount: accountId,
      },
    });
    res.status(204).send();
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "deletePayments", error: JSON.stringify(error) },
    });
    res.status(500).json({ error: "Error al eliminar los pagos." });
  }
};
