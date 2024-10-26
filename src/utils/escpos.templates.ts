import { lineFeed } from "./chatacters";
import {
  formatAreas,
  formatCurrency,
  formatMoney,
  formatProducts,
  formatTaxes,
  formatTaxesStatus,
  padBackString,
  padFrontString,
} from "./escpos.format";

export const xmlVenta = (cuenta: any) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
        <text-line>${
          cuenta.table
        }</text-line>${lineFeed}        <text-line>Dependiente: ${
  cuenta.dependent ?? "Sin asignar"
}</text-line>${lineFeed}        <text-line>Personas: ${
  cuenta.people
}</text-line>${lineFeed}        <text-line>Fecha: ${cuenta.initDate.toLocaleDateString(
  "es-ES"
)}</text-line>${lineFeed}        <text-line>Hora: ${cuenta.initTime.toLocaleTimeString(
  "es-ES"
)}</text-line>${lineFeed}    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    <align mode="left">
        ${formatProducts(cuenta.order)}
   </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
     <align mode="left">
     <text-line>SUBTOTAL:           $${padFrontString(
       cuenta.subTotal.toFixed(2),
       11
     )}</text-line>${lineFeed}        <bold>
        <text-line>Cantidad de productos:${padFrontString(
          cuenta.productsCount,
          10
        )}</text-line>${lineFeed}        </bold>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    <align mode="left">
       ${formatTaxes(cuenta.taxes)}
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    <align mode="center">
    <bold> 
        <text-line size="1:1">CUENTA</text-line></bold>${lineFeed}
    </align>
    <align mode="center">
    <bold>
        <text-line size="1:1">$ ${cuenta.toPay.toFixed(
          2
        )} CUP</text-line>${lineFeed}</bold>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    <align mode="left">
   ${formatCurrency(cuenta.currency)}
</document>
`;
export const xmlVentaArea = (
  areas: any
) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
        <text-line>VENTAS POR AREA</text-line>${lineFeed}        <text-line>Fecha: ${new Date(
  Date.now()
).toLocaleDateString(
  "es-ES"
)}</text-line>${lineFeed}        <text-line>Hora: ${new Date(
  Date.now()
).toLocaleTimeString("es-ES")}</text-line>${lineFeed}    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    ${formatAreas(areas)}
</document>
`;
export const xmlEstadoCaja = (
  inform: any
) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
        <text-line>REPORTE DE CAJA</text-line>${lineFeed}
        <text-line>FECHA: ${new Date(Date.now()).toLocaleDateString(
          "es-ES"
        )}</text-line>${lineFeed}
        <text-line>HORA: ${new Date(Date.now()).toLocaleTimeString(
          "es-ES"
        )}</text-line>${lineFeed}
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}
    </align>
    <align mode="left">
     <text-line>Saldo inicial:      $${padFrontString(
       inform.initialCash?.toFixed(2),
       11
     )}</text-line>${lineFeed}
     <text-line>Ingreso total:      $${padFrontString(
       inform.ingresoTotal?.toFixed(2),
       11
     )}</text-line>${lineFeed}
     <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>${lineFeed}
  <text-line>De ello...</text-line>${lineFeed}
     <text-line>-Venta bruta:       $${padFrontString(
       inform.ventaBruta?.toFixed(2),
       11
     )}</text-line>${lineFeed}
     ${formatTaxesStatus(inform.impuestos)}
    <text-line>-Propina:           $${padFrontString(
      inform.propina?.toFixed(2),
      11
    )}</text-line>${lineFeed}

     <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}
    </align>
    <text-line>Efectivo en caja:</text-line>${lineFeed}
${formatMoney(inform.efectivo)}
<text-line>Montos en transferencia:</text-line>${lineFeed}
${formatMoney(inform.transferencia ?? 0)}
    </align>
     <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}
    </align>
    <text-line>Balance:            $${padFrontString(
      inform.balance?.toFixed(2),
      11
    )}</text-line>${lineFeed}
</document>
`;
export const xmlEstadoCaja2 = (
  cuenta: any
) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
      <align mode="left">
      <text-line>Fecha: ${cuenta.initDate.toLocaleDateString(
        "es-ES"
      )}</text-line>${lineFeed}      <text-line>Hora: ${cuenta.initTime.toLocaleTimeString(
  "es-ES"
)}</text-line>${lineFeed}      <text-line>Área: ${
  cuenta.dependent ?? "Sin definir"
}</text-line>${lineFeed}    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    <align mode="left">
       <text-line>${padBackString("Saldo inicial: ", 20)}$${padFrontString(
  "1,080.00",
  11
)}</text-line>${lineFeed}        <text-line>${padBackString(
  "Ingreso total: ",
  20
)}$${padFrontString(
  "592,369.00",
  11
)}</text-line>${lineFeed}        <text-line>${padBackString(
  "De ello: ",
  20
)}</text-line>${lineFeed}        <text-line>- ${padBackString(
  "Venta bruta: ",
  18
)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>${lineFeed}        <text-line>- ${padBackString(
  "10% Servicio: ",
  18
)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>${lineFeed}        <text-line>- ${padBackString(
  "Propinas: ",
  18
)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>${lineFeed}        <text-line>- ${padBackString(
  "Descuentos: ",
  18
)}$${padFrontString(
  "557,140.00",
  11
)}</text-line>${lineFeed}        <text-line>- ${padBackString(
  "Clientes: ",
  18
)}$${padFrontString("557,140.00", 11)}</text-line>${lineFeed}   </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
     <align mode="left">
     <bold>
     <text-line>Desgloce:</text-line>${lineFeed}     </bold>
        <text-line>Cocina:</text-line>${lineFeed}        <text-line> 1 Pollo frito</text-line>${lineFeed}        <text-line> 3 Carne asada</text-line>${lineFeed}        <text-line>Pizeria:</text-line>${lineFeed}        <text-line> 1 Pizza de Jamon</text-line>${lineFeed}        <text-line> 3 Pizza mixta</text-line>${lineFeed}    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>${lineFeed}    </align>
    ${lineFeed}
    ${lineFeed}
</document>
`;
