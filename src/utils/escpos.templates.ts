import { lineFeed } from "./chatacters";
import {
  formatAreas,
  formatCurrency,
  formatMoney,
  formatProducts,
  formatTaxes,
  formatTaxesStatus,
  padBackString,
  padFillString,
  padFrontString,
  paperSize,
} from "./escpos.format";
import { printerPaperSize } from "./paperSize";

export const xmlVenta = (cuenta: any) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
<small></small>
<text-line>${cuenta.table}</text-line>${lineFeed}
 <align mode="center">
  <align mode="left">
    <text-line>Dependiente: ${
      cuenta.dependent ?? "Sin asignar"
    }</text-line>${lineFeed}
    <text-line>Personas: ${cuenta.people}</text-line>${lineFeed}
    <text-line>Fecha: ${cuenta.initDate.toLocaleDateString(
      "es-ES"
    )}</text-line>${lineFeed}
    <text-line>Hora: ${cuenta.initTime.toLocaleTimeString(
      "es-ES"
    )}</text-line>${lineFeed}
  </align>
  </align>
   <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="left">${formatProducts(cuenta.order)}</align>
   <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="left">
    <text-line>${padBackString(
      "Subtotal:",
      printerPaperSize[paperSize ?? 0].productName
    )}$${padFrontString(
  cuenta.subTotal.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}<bold>
    <text-line>${padBackString(
      "Cantidad de productos:",
      printerPaperSize[paperSize ?? 0].productName
    )}${padFrontString(
  cuenta.productsCount,
  printerPaperSize[paperSize ?? 0].productAmount
)}</text-line>${lineFeed}</bold>
  </align>
    <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="center">
  <align mode="left">${formatTaxes(cuenta.taxes)}</align>
   <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="center">
    <bold><text-line size="1:1">CUENTA</text-line></bold>${lineFeed}
  </align>
  <align mode="center">
   <bold>
    <text-line size="1:1">$ ${cuenta.toPay.toFixed(
      2
    )} CUP</text-line>${lineFeed}</bold>
  </align>
    <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="left">${formatCurrency(cuenta.currency)} </align>
</small>
${
  cuenta.totalPaid > 0
    ? `<text-line size="0:0">${padFillString(
        printerPaperSize[paperSize ?? 0].characters
      )}</text-line>${lineFeed}`
    : ""
}
${
  cuenta.totalPaid > 0
    ? `<text-line>${padBackString(
        "Pagado:",
        printerPaperSize[paperSize ?? 0].productName
      )}$${padFrontString(
        cuenta.totalPaid.toFixed(2),
        printerPaperSize[paperSize ?? 0].productPrice
      )}</text-line>${lineFeed}<text-line>${padBackString(
        "Vuelto:",
        printerPaperSize[paperSize ?? 0].productName
      )}$${padFrontString(
        cuenta.change.toFixed(2),
        printerPaperSize[paperSize ?? 0].productPrice
      )}</text-line>${lineFeed}`
    : ""
}
${
  cuenta.propina > 0
    ? `<text-line>${padBackString(
        "Propina:",
        printerPaperSize[paperSize ?? 0].productName
      )}$${padFrontString(
        cuenta.propina.toFixed(2),
        printerPaperSize[paperSize ?? 0].productPrice
      )}</text-line>${lineFeed}`
    : ""
}
</document>
`;
export const xmlVentaArea = (
  areas: any
) => `<?xml version="1.0" encoding="UTF-8"?>
<document>
  <align mode="left">
    <text-line>VENTAS POR AREA</text-line>${lineFeed}
    <text-line>Fecha: ${new Date(Date.now()).toLocaleDateString(
      "es-ES"
    )}</text-line>${lineFeed}
    <text-line>Hora: ${new Date(Date.now()).toLocaleTimeString(
      "es-ES"
    )}</text-line>${lineFeed}
  </align>
   <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
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
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <align mode="left">
  <text-line>${padBackString(
    "Saldo inicial:",
    printerPaperSize[paperSize ?? 0].productName
  )}$${padFrontString(
  inform.initialCash?.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}
  <text-line>${padBackString(
    "Ingreso total:",
    printerPaperSize[paperSize ?? 0].productName
  )}$${padFrontString(
  inform.ingresoTotal?.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}
  <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <text-line>De ello...</text-line>${lineFeed}
  <text-line>${padBackString(
    "-Venta bruta:",
    printerPaperSize[paperSize ?? 0].productName
  )}$${padFrontString(
  inform.ventaBruta?.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}
     ${formatTaxesStatus(inform.impuestos)}
  <text-line>${padBackString(
    "-Propina:",
    printerPaperSize[paperSize ?? 0].productName
  )}$${padFrontString(
  inform.propina?.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}
   <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <text-line>Efectivo en caja:</text-line>${lineFeed}
  ${formatMoney(inform.efectivo)}
  <text-line>Montos en transferencia:</text-line>${lineFeed}
  ${formatMoney(inform.transferencia ?? 0)}
  </align>
    <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>
  <text-line>${padBackString(
    "Balance:",
    printerPaperSize[paperSize ?? 0].productName
  )}$${padFrontString(
  inform.balance?.toFixed(2),
  printerPaperSize[paperSize ?? 0].productPrice
)}</text-line>${lineFeed}
</document>
`;
