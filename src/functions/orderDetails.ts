import { AccountDetails, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getOrderAccountDetails = async ({
  idAccount,
  idOffer,
}: {
  idAccount: string;
  idOffer: string;
}) => {
  try {
    const orderAccountDetail = await prisma.accountDetails.findFirst({
      where: { idAccount, idOffer },
    });
    return orderAccountDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      "Error obteniendo la información de la orden de esta cuenta"
    );
  }
};
export const createOrderDetail = async ({
  idAccount,
  idOffer,
  quantity,
}: Partial<AccountDetails>) => {
  try {
    if (idAccount && idOffer) {
      const orderAccountDetail = await prisma.accountDetails.create({
        data: { idAccount, idOffer, quantity: quantity ?? 1 },
      });
      return orderAccountDetail;
    }
    throw new Error(
      `El identificador de ${
        idAccount ? "la oferta" : "la cuenta"
      } no está definido`
    );
  } catch (error: any) {
    console.log(error);
    throw new Error("No se ha podido agregar la orden a la cuenta");
  }
};
export const updateOrderDetail = async (orderDetail: AccountDetails) => {
  try {
    const orderAccountDetail = await prisma.accountDetails.update({
      where: { id: orderDetail.id },
      data: orderDetail,
    });
    return orderAccountDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error modificando la orden de esta cuenta");
  }
};
export const deleteOrderDetail = async (orderDetail: AccountDetails) => {
  try {
    const orderAccountDetail = await prisma.accountDetails.delete({
      where: { id: orderDetail.id },
    });
    return orderAccountDetail;
  } catch (error: any) {
    console.log(error);
    throw new Error("Error elimiando la orden de esta cuenta");
  }
};
export const modifyOrderDetail = ({
  detail,
  quantity,
  negative,
}: {
  detail: AccountDetails;
  quantity: number;
  negative: boolean;
}) => {
  detail.quantity = negative
    ? detail.quantity - quantity
    : detail.quantity + quantity;
  return detail;
};
