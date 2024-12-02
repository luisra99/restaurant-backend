import { PrismaClient } from "@prisma/client";
import { getDivisas } from "../controller/divisa.controller";
const prisma = new PrismaClient();

export const getAccountFunction = async ({ id, distinct }: any) => {
  const account = await prisma.account.findFirst({
    where: { id: id },
    include: {
      table: true,
      details: { include: { offer: true } },
      type: true,
      dependent: true,
    },
  });

  // Obtener todos los pagos de la cuenta
  const payments = await prisma.payment.findMany({
    where: { idAccount: id },
  });

  // Obtener todas las propinas de la cuenta
  const propinas = await prisma.income.findMany({
    where: { idAccount: id },
  });
  console.log(propinas);

  // Sumar los montos de los pagos
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );
  // Sumar los montos de las propinas
  const propina = propinas.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

  function mapAndGroupDetails(details: any[]) {
    // Filtrar los detalles que tienen marchado distinto de null
    const filteredDetails = details.filter(
      (detail) => detail.marchado !== null
    );

    // Agrupar los detalles por idOffer y acumular la cantidad de cada grupo
    const groupedDetails = filteredDetails.reduce((acc, detail) => {
      if (!acc[detail.idOffer]) {
        // Si no existe el grupo, inicializarlo
        acc[detail.idOffer] = {
          id: detail.offer.id,
          name: detail.offer.name,
          quantity: 0,
          marchado: true,
          totalPrice: 0,
        };
      }

      // Sumar la cantidad y el precio total al grupo existente
      acc[detail.idOffer].quantity += detail.quantity;
      acc[detail.idOffer].totalPrice +=
        detail.quantity * Number(detail.offer.price);

      return acc;
    }, {} as Record<string, { id: string; name: string; quantity: number; totalPrice: number }>);

    // Convertir el resultado a un array
    return Object.values(groupedDetails);
  }
  const marchadas = mapAndGroupDetails(account?.details ?? []);
  const sinMarchar = (account?.details ?? [])
    .filter((detail: any) => detail.marchado == null)
    .map((detail: any) => {
      return {
        id: detail.offer.id,
        name: detail.offer.name,
        quantity: detail.quantity,
        marchado: false,
        totalPrice: detail.quantity * Number(detail.offer.price), // Multiplica cantidad por precio
      };
    });

  const orders = distinct
    ? [...marchadas, ...sinMarchar]
    : (account?.details ?? []).map((detail: any) => {
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
    (sum: any, order: any) => sum + order.quantity,
    0
  );

  // Calcular el precio total de todas las ofertas
  const totalPrice =
    orders?.reduce((sum: number, order: any) => sum + order.totalPrice, 0) ?? 0;

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

  // Enviar la respuesta incluyendo el total pagado
  return {
    ...account,
    mappedTaxsDiscounts,
    orders,
    totalQuantity,
    totalPrice,
    finalPrice,
    divisaAmount,
    dependent: account?.dependent?.name,
    propina,
    totalPaid,
  };
};
export const getAllAccountsFunction = async () => {
  const cuentaCasaConcept = await prisma.concept.findFirst({
    where: { denomination: "Cuenta casa" },
  });
  let accounts = await prisma.account.findMany({
    where: { closed: { not: null }, idType: { not: cuentaCasaConcept?.id } },
  });
  const accountsResume = Promise.all(
    accounts?.map(async (account) => await getAccountFunction(account))
  );
  return accountsResume;
};
export const getActiveDiscounts = async () => {
  try {
    const activeTaxDiscounts = await prisma.taxDiscounts.findMany({
      where: {
        status: true,
      },
    });
    const activeTaxDiscountsIds = activeTaxDiscounts.map((tax) => tax.id);
    return activeTaxDiscountsIds;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error obteniendo los impuestos y descuentos activos");
  }
};
export const closeThisAccount = async (id: string) => {
  try {
    await prisma.account.update({
      where: { id: id },
      data: { closed: new Date() },
    });
  } catch (error: any) {
    console.log(error);
    throw new Error("Error cerrando la cuenta");
  }
};
