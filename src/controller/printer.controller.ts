import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getDivisas } from "./divisa.controller";
import { printAccount } from "../utils/print";
import { getAccountFunction } from "../functions/account";
import { print } from "../libs/escpos";
import { xmlVentaArea } from "../utils/escpos.templates";

const prisma = new PrismaClient();

export const printRecip = async (req: Request, res: Response) => {
  try {
    const account = await getAccountFunction(req.params);
    printAccount(account);
    res.status(200).json(account);
  } catch (error) {
    console.log(error);
    prisma.errorLogs.create({
      data: { info: "printRecip", error: JSON.stringify(error) },
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
export const printAreas = async (req: Request, res: Response) => {
  try {
    const groupedOffers = await prisma.accountDetails.groupBy({
      by: ["idOffer"], // Agrupar por idOffer
      _sum: {
        quantity: true, // Sumar las cantidades
      },
    });

    // Extraemos los IDs de las ofertas del resultado agrupado
    const offerIds = groupedOffers.map((group) => group.idOffer);

    // Hacemos una segunda consulta para obtener los detalles de las ofertas
    const offers = await prisma.offer.findMany({
      where: {
        id: { in: offerIds },
      },
      include: {
        area: true, // Relacionar con el área (concepto) si el modelo Offer tiene relación con Concept por idArea
      },
    });

    // Mapeamos los resultados agrupados con los detalles de las ofertas
    const result = groupedOffers.map((group: any) => {
      const offer = offers.find((o) => o.id === group.idOffer);
      return {
        // offerId: group.idOffer,
        offerName: offer?.name,
        // idArea: offer?.idArea,
        totalQuantity: group._sum.quantity ?? 0,
        price: Number(offer?.price) * (group._sum.quantity ?? 0),
        areaDenomination: offer?.area?.denomination || "Sin denominación", // Denominación del área o un valor por defecto
      };
    });

    // Agrupar por areaDenomination
    const groupedByArea = result.reduce((acc: any, current: any) => {
      const key = current.areaDenomination;
      if (!acc[key]) {
        acc[key] = []; // Si no existe la clave, inicializa un array
      }
      delete current.areaDenomination;
      acc[key].push(current); // Agrega el elemento al array correspondiente
      return acc;
    }, {});
    print(groupedByArea, xmlVentaArea);
    res.status(200).json(groupedByArea);
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "printAreas", error: JSON.stringify(error) },
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
export const printStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: { id: id },
      include: {
        table: true,
        details: { include: { offer: true } },
        type: true,
      },
    });
    const orders = account?.details.map((detail) => {
      return {
        id: detail.offer.id,
        name: detail.offer.name,
        quantity: detail.quantity,
        totalPrice: detail.quantity * Number(detail.offer.price), // Multiplica cantidad por precio
      };
    });
    const divisas = await getDivisas();

    // Calcular el total de todas las cantidades
    const totalQuantity = orders?.reduce(
      (sum, order) => sum + order.quantity,
      0
    );
    // Calcular el total de todas las cantidades
    // Calcular el precio total de todas las ofertas
    const totalPrice =
      orders?.reduce((sum, order) => sum + order.totalPrice, 0) ?? 0;

    const taxsDiscounts = account?.taxDiscount.length
      ? await prisma.taxDiscounts.findMany({
          where: {
            id: { in: account.taxDiscount },
          },
        })
      : [];
    // Calcular el precio final basado en los impuestos y descuentos
    let finalPrice: number = totalPrice;
    const mappedTaxsDiscounts = taxsDiscounts.map((item: any) => {
      const amount = (item.percent / 100) * totalPrice;

      // Si es impuesto, lo sumamos al precio final
      if (item.tax) {
        finalPrice += amount;
      } else {
        // Si es descuento, lo restamos del precio final
        finalPrice -= amount;
      }

      // Devolvemos el objeto con el monto calculado
      return {
        ...item,
        amount, // Monto calculado basado en el percent
      };
    });
    const divisaAmount = divisas?.map((divisa: any) => {
      return {
        denomination: divisa.denomination,
        amount: (
          finalPrice / Number(parseFloat(divisa.details).toFixed(2))
        ).toFixed(2),
      };
    });
    res.status(200).json({
      ...account,
      mappedTaxsDiscounts,
      orders,
      totalQuantity,
      totalPrice,
      finalPrice,
      divisaAmount,
    });
  } catch (error) {
    prisma.errorLogs.create({
      data: { info: "printStatus", error: JSON.stringify(error) },
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
