import { print } from "../libs/escpos";
import { xmlVenta } from "./escpos.templates";

export const printAccount = (account: any) => {
  const cuenta = {
    table: account?.table?.name ?? account.name,
    location: account?.table.details ?? "",
    people: account.people,
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

    currency: account.divisaAmount.map(
      ({ denomination: name, amount }: any) => {
        return {
          name,
          amount,
        };
      }
    ),
  };
  console.log(cuenta);
  print(cuenta, xmlVenta);
};
