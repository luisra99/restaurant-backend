import { PrismaClient } from "@prisma/client";
import { getDivisas } from "../controller/divisa.controller";
const prisma = new PrismaClient();

export const getAccountFunction = async ({ id }: any) => {
  const account = await prisma.account.findFirst({
    where: { id: Number(id) },
    include: {
      table: true,
      details: { include: { offer: true } },
      type: true,
      dependent: true,
    },
  });

  // Obtener todos los pagos de la cuenta
  const payments = await prisma.payment.findMany({
    where: { idAccount: Number(id) },
  });

  // Sumar los montos de los pagos
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amount),
    0
  );

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
  const totalQuantity = orders?.reduce((sum, order) => sum + order.quantity, 0);

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
