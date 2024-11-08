import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getDivisaConcept, getPropinaConcept } from "../functions/concepts";
import { getDivisaConversionRateAmount } from "../utils/calc";

const prisma = new PrismaClient();

export const setPropina = async (req: Request, res: Response) => {
  try {
    let { amount, idDivisa, idAccount } = req.body;
    const propina = Math.abs(amount);
    let propinaData: any = {
      amount: propina,
    };

    if (idDivisa) {
      const currencyConcept = await getDivisaConcept(idDivisa);
      propinaData.amount = getDivisaConversionRateAmount(
        propina,
        currencyConcept
      );
    }

    if (idDivisa) propinaData.idDivisa = idDivisa;
    if (idAccount) propinaData.idAccount = idAccount;

    const { id } = await getPropinaConcept();
    if (id) {
      propinaData.idConcepto = id;
    }
    if (idAccount) {
      const _existPropina = await prisma.income.findFirst({
        where: { idAccount: idAccount },
      });
      if (_existPropina) {
        const updated = await prisma.income.update({
          where: { id: _existPropina.id },
          data: propinaData,
        });
        return res.status(201).json(updated);
      }
    }
    const propinaLog = await prisma.income.create({
      data: propinaData,
    });
    res.status(201).json(propinaLog);
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ error: error.message || "Error al registrar la propina." });
  }
};
