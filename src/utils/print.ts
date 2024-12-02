import { print } from "../libs/escpos";
import { xmlVenta } from "./escpos.templates";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const printAccount = async (account: any) => {
  try {
    const conceptoCasa = await prisma.concept.findFirst({
      where: { denomination: "Cuenta casa" },
    });
    if (account.idType == conceptoCasa?.id) account.finalPrice = 0;
    const cuenta = {
      table: account?.table?.name ?? "",
      location: account?.table?.details ?? "",
      people: account.people ?? "Sin especificar",
      initDate: account.created,
      initTime: account.created,
      dependent: account.dependent,
      order: account.details.map(
        ({ quantity: count, offer: { name: product, price } }: any) => {
          return {
            count,
            product,
            price: price * count,
          };
        }
      ),
      subTotal: account.totalPrice,
      taxes: account.mappedTaxsDiscounts,
      productsCount: account.totalQuantity,
      toPay: account.finalPrice,
      totalPaid: account.totalPaid,
      change: account.finalPrice - account.totalPaid,
      propina: account.propina,
      currency: account.divisaAmount.map(
        ({ denomination: name, amount }: any) => {
          return {
            name,
            amount,
          };
        }
      ),
    };
    print(cuenta, xmlVenta);
  } catch (error) {
    console.log(error);
    throw new Error("Error al enviar datos a la impresora.");
  }
};
