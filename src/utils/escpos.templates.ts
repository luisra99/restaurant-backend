import {
  formatProducts,
  formatTaxes,
  padBackString,
  padFrontString,
} from "./escpos.format";

export const xmlVenta = (cuenta: any) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
        <text-line>${cuenta.table}</text-line>
        <text-line>Dependiente: ${cuenta.dependent}</text-line>
        <text-line>Personas: ${cuenta.people}</text-line>
        <text-line>Fecha: ${cuenta.initDate}</text-line>
        <text-line>Hora: ${cuenta.initTime}</text-line>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="left">
        ${formatProducts(cuenta.order)}
   </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
     <align mode="left">
     <text-line>SUBTOTAL:           $${padFrontString(
       cuenta.subTotal,
       11
     )}</text-line>
        <bold>
        <text-line>Cantidad de productos:${padFrontString(
          cuenta.productsCount,
          10
        )}</text-line>
        </bold>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="left">
       ${formatTaxes(cuenta.taxes)}
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="center">
    <bold> 
        <text-line size="2:1">CUENTA</text-line></bold>
    </align>
    <align mode="center">
    <bold>
        <text-line size="1:1">$ ${cuenta.toPay} CUP</text-line></bold>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="left">
    ${cuenta.currency.map(({ name, amount }: any) => {
      const text = `A pagan en ${name}`;
      return `<text-line>${padBackString(text, 20)}$${padFrontString(
        amount,
        11
      )}</text-line>`;
    })}
    </align>
    <line-feed />
    <line-feed />
</document>
`;
export const xmlEstadoCaja = (
  cuenta: any
) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
      <text-line>Fecha: ${cuenta.initDate}</text-line>
      <text-line>Hora: ${cuenta.initTime}</text-line>
      <text-line>Área: ${cuenta.dependent}</text-line>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="left">
       <text-line>${padBackString("Saldo inicial: ", 20)}$${padFrontString(
  "1,080.00",
  11
)}</text-line>
        <text-line>${padBackString("Ingreso total: ", 20)}$${padFrontString(
  "592,369.00",
  11
)}</text-line>
        <text-line>${padBackString("De ello: ", 20)}</text-line>
        <text-line>- ${padBackString("Venta bruta: ", 18)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>
        <text-line>- ${padBackString("10% Servicio: ", 18)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>
        <text-line>- ${padBackString("Propinas: ", 18)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>
        <text-line>- ${padBackString("Descuentos: ", 18)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>
        <text-line>- ${padBackString("Clientes: ", 18)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>
   </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
     <align mode="left">
     <bold>
     <text-line>Desgloce:</text-line>
     </bold>
        <text-line>Cocina:</text-line>
        <text-line> 1 Pollo frito</text-line>
        <text-line> 3 Carne asada</text-line>
        <text-line>Pizeria:</text-line>
        <text-line> 1 Pizza de Jamon</text-line>
        <text-line> 3 Pizza mixta</text-line>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <line-feed />
    <line-feed />
</document>
`;
