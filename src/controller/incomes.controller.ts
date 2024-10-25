import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const setPropina = async (req: Request, res: Response) => {
  try {
    let { amount, idDivisa } = req.body;

    if (idDivisa) {
      const currencyConcept = await prisma.concept.findUnique({
        where: {
          id: Number(idDivisa), // Convertimos a número para buscar el id
        },
      });

      // Verificar si se encontró el concepto y que details es un número
      if (currencyConcept && currencyConcept.details) {
        const conversionRate = Number(currencyConcept.details);
        if (!isNaN(conversionRate)) {
          // Multiplicar amount por el tipo de cambio
          amount *= conversionRate;
        }
      } else {
        return res
          .status(400)
          .json({ error: "Divisa no válida o sin tasa de conversión." });
      }
    }
    let propinaData: any = {
      amount,
    };
    if (idDivisa) propinaData.idDivisa = Number(idDivisa);

    const propina = await prisma.concept.findFirst({
      where: { denomination: { equals: "Propina" } },
    });
    if (propina) {
      propinaData.idConcepto = propina.id;
    } else {
      const { id } = await prisma.concept.create({
        data: { denomination: "Propina" },
      });
      propinaData.idConcepto = id;
    }

    const propinaLog = await prisma.income.create({
      data: propinaData,
    });

    res.status(201).json(propinaLog);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "pay", error: JSON.stringify(error) },
    });
    console.log(error);
    res.status(500).json({ error: "Error al registrar el pago." });
  }
};
