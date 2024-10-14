const escpos = require("escpos");
const usb = require("usb");
escpos.USB = require("escpos-usb");
const devices = escpos.USB.findPrinter();
import { EscPos } from "@tillpos/xml-escpos-helper";
const cuenta = {
  table: "Mesa 14",
  location: "Terraza",
  people: 3,
  initDate: "4/23/23",
  initTime: "16:04",
  dependent: "Adriana",
  orders: [
    { count: 3, product: "Salchipapa", price: "5.45" },
    {
      count: 2,
      product: "Batido  de crema de  avellanas y cacao molido especial",
      price: "5.4",
    },
  ],
  subTotal: "6.65",
  taxes: [{ name: "Impuestos sobre el consumo", percent: 10, amount: "1.5" }],
  productsCount: "4",
  toPay: 4.2,
  currency: [
    { name: "USD", amount: 3.4 },
    { name: "EUR", amount: 2.3 },
  ],
};
function padFrontString(input: string, pad: number) {
  // Comprueba si el input es un string
  if (typeof input !== "string") {
    throw new Error("El argumento debe ser un string");
  }

  // Rellena con espacios en blanco al principio si la longitud es menor a 10
  while (input.length < pad) {
    input = " " + input; // Añade un espacio al principio
  }

  return input;
}
function padBackString(input: string, pad: number) {
  // Comprueba si el input es un string
  if (typeof input !== "string") {
    throw new Error("El argumento debe ser un string");
  }

  // Rellena con espacios en blanco al principio si la longitud es menor a 10
  while (input.length < pad) {
    input = input + " "; // Añade un espacio al principio
  }

  return input;
}

// Ejemplo de uso
const cabecera = ``;
const products = () => {
  let productsArray: string[] = []; // Cambia a un array para acumular las líneas
  cuenta.orders.forEach((order) => {
    const _order = `${order.count} ${order.product}`;
    if (_order.length < 19) {
      // Usa push para añadir al array
      productsArray.push(
        `<text-line>${padBackString(_order, 20)}$${padFrontString(
          order.price,
          11
        )}</text-line>`
      );
    } else {
      // Si _order no es menor de 19, hacemos split
      const words = _order.split(" "); // Divide la cadena en palabras
      let currentLine = "";
      let revisadas: string[] = [];

      for (let word of words) {
        // Verifica si añadir la palabra actual excede el límite
        revisadas.push(word);
        if ((currentLine + word).length < 19) {
          currentLine += (currentLine ? " " : "") + word; // Añadir espacio si no es la primera palabra
          if (words.length == revisadas.length) {
            productsArray.push(
              `<text-line>${padBackString(currentLine, 20)}$${padFrontString(
                order.price,
                11
              )}</text-line>`
            );
            break;
          }
        } else {
          productsArray.push(
            `<text-line>${
              words.length == revisadas.length
                ? `${padBackString(currentLine, 20)}$${padFrontString(
                    order.price,
                    11
                  )}`
                : currentLine
            }</text-line>`
          );
          currentLine = "";
        }
      }
    }
  });
  return productsArray.join("");
};
const taxes = () => {
  let taxesArray: string[] = []; // Cambia a un array para acumular las líneas
  cuenta.taxes.forEach((tax) => {
    const _tax = `${tax.name} ${tax.percent}%`;
    if (_tax.length < 19) {
      // Usa push para añadir al array
      taxesArray.push(
        `<text-line>${padBackString(_tax, 20)}$${padFrontString(
          tax.amount,
          11
        )}</text-line>`
      );
    } else {
      // Si _order no es menor de 19, hacemos split
      const words = _tax.split(" "); // Divide la cadena en palabras
      let currentLine = "";
      let revisadas: string[] = [];

      for (let word of words) {
        // Verifica si añadir la palabra actual excede el límite
        revisadas.push(word);
        if ((currentLine + word).length < 19) {
          currentLine += (currentLine ? " " : "") + word; // Añadir espacio si no es la primera palabra
          if (words.length == revisadas.length) {
            taxesArray.push(
              `<text-line>${padBackString(currentLine, 20)}$${padFrontString(
                tax.amount,
                11
              )}</text-line>`
            );
            break;
          }
        } else {
          taxesArray.push(
            `<text-line>${
              words.length == revisadas.length
                ? `${padBackString(currentLine, 20)}$${padFrontString(
                    tax.amount,
                    11
                  )}`
                : currentLine
            }</text-line>`
          );
          currentLine = "";
        }
      }
    }
  });
  return taxesArray.join("");
};

const xmlVenta = `<?xml version="1.0" encoding="UTF-8"?>
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
        ${products()}
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
       ${taxes()}
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
        <text-line size="1:1">$ 220,000.00 CUP</text-line></bold>
    </align>
    <align mode="center">
        <text-line size="0:0">- - - - - - - - - - - - - - - -</text-line>
    </align>
    <align mode="left">
        <text-line>A pagar en USD:      $ 628.00</text-line>
        <text-line>A pagar en MLC:      $ 689.00</text-line>
        <text-line>A pagar en EUR:      $ 625.00</text-line>
    </align>
    <line-feed />
    <line-feed />
</document>
`;
const xmlEstadoCaja = `<?xml version="1.0" encoding="UTF-8"?>
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

const bufferVenta = EscPos.getBufferFromXML(xmlVenta);
const bufferCaja = EscPos.getBufferFromXML(xmlEstadoCaja);
function imprimirRecibo(buffer: any) {
  const device = usb.findByIds(4070, 33054);
  if (device) {
    device.open();
    const iface = device.interfaces[0];
    iface.claim();
    const endpoint = iface.endpoints[0];
    endpoint.transfer(buffer, (error: any) => {
      if (error) {
        console.error("Error al enviar datos a la impresora:", error);
      } else {
        console.log("Etiqueta impresa correctamente.");
      }
      device.close();
    });
  } else {
    console.error("No se encontró la impresora.");
  }
}

// imprimirRecibo(bufferCaja);
