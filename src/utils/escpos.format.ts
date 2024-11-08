import { lineFeed } from "./chatacters";
import { printerPaperSize } from "./paperSize";

export const paperSize = process.env.PAPER_SIZE;

export function padFrontString(input: any, pad: number) {
  while (input?.toString().length < pad) {
    input = " " + input; // Añade un espacio al principio
  }
  return input;
}
export function padBackString(input: any, pad: number) {
  while (input?.toString().length < pad) {
    input = input + " "; // Añade un espacio al principio
  }
  return input;
}
export function padFillString(pad: number) {
  let input = "";
  while (input?.length < pad) {
    input = input + " - "; // Añade un espacio al principio
  }
  return input.trim();
}
export const formatProducts = (products: any[]) => {
  let productsArray: string[] = []; // Array para acumular las líneas
  if (paperSize) {
    products.forEach((order) => {
      const _order = `${order.count} ${order.product}`;
      let price = `$${padFrontString(
        order.price.toFixed(2),
        printerPaperSize[paperSize].productPrice
      )}`;

      // Verificamos si la línea completa con el precio cabe en printerPaperSize[paperSize].breakLine caracteres
      if (_order.length <= printerPaperSize[paperSize].breakLine) {
        productsArray.push(
          `<text-line>${padBackString(
            _order,
            printerPaperSize[paperSize].productName
          )}${price}</text-line>${lineFeed}`
        );
      } else {
        // Si no cabe, lo dividimos en múltiples líneas
        const words = _order.split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];

          // Verificamos si añadir la palabra actual excede los printerPaperSize[paperSize].breakLine caracteres
          if (
            (currentLine + " " + word).trim().length <=
            printerPaperSize[paperSize].breakLine
          ) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            // Si la línea actual está completa, la agregamos al array
            productsArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}</text-line>${lineFeed}`
            );
            currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
          }

          // Si es la última palabra, añadimos la línea final con el precio
          if (i === words.length - 1) {
            productsArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}${price}</text-line>${lineFeed}`
            );
          }
        }
      }
    });

    return productsArray.join("");
  }
};
export const formatAreaProduct = (products: any[]) => {
  let productsArray: string[] = []; // Array para acumular las líneas

  if (paperSize) {
    products.forEach((product) => {
      let name = `${product.offerName}`;
      // Verificamos si la línea completa con el precio cabe en printerPaperSize[paperSize].breakLine caracteres
      if (name.length < printerPaperSize[paperSize].breakLine) {
        productsArray.push(
          `<text-line>${padBackString(
            name,
            printerPaperSize[paperSize].productName
          )}${padFrontString(
            product.totalQuantity,
            printerPaperSize[paperSize].productAmount
          )}</text-line>${lineFeed}`
        );
      } else {
        // Si no cabe, lo dividimos en múltiples líneas
        const words = name.split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];

          // Verificamos si añadir la palabra actual excede los printerPaperSize[paperSize].breakLine caracteres
          if (
            (currentLine + " " + word).trim().length <=
            printerPaperSize[paperSize].breakLine
          ) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            // Si la línea actual está completa, la agregamos al array
            productsArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}</text-line>${lineFeed}`
            );
            currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
          }

          // Si es la última palabra, añadimos la línea final con el precio
          if (i === words.length - 1) {
            productsArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}${padFrontString(
                product.totalQuantity,
                printerPaperSize[paperSize].productPrice
              )}</text-line>${lineFeed}`
            );
          }
        }
      }
    });

    return productsArray.join("");
  }
};
export const formatTaxes = (taxes: any[]) => {
  let taxesArray: string[] = []; // Array para acumular las líneas
  if (paperSize) {
    taxes.forEach((tax: any) => {
      const _tax = `${tax.name} (${!tax.tax ? "-" : ""}${tax.percent}%)`;
      let amount = `$${padFrontString(
        tax.amount.toFixed(2),
        printerPaperSize[paperSize].productPrice
      )}`;

      // Verificamos si la línea completa cabe en printerPaperSize[paperSize].breakLine caracteres
      if (_tax.length <= printerPaperSize[paperSize].breakLine) {
        taxesArray.push(
          `<text-line>${padBackString(
            _tax,
            printerPaperSize[paperSize].productName
          )}${amount}</text-line>${lineFeed}`
        );
      } else {
        // Si no cabe, lo dividimos en múltiples líneas
        const words = _tax.split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];

          // Verificamos si añadir la palabra actual excede los printerPaperSize[paperSize].breakLine caracteres
          if (
            (currentLine + " " + word).trim().length <=
            printerPaperSize[paperSize].breakLine
          ) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            // Si la línea actual está completa, la agregamos al array
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}</text-line>${lineFeed}`
            );
            currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
          }

          // Si es la última palabra, añadimos la línea final con el monto
          if (i === words.length - 1) {
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}${amount}</text-line>${lineFeed}`
            );
          }
        }
      }
    });

    return taxesArray.join("");
  }
};
export const formatAreas = (areas: any) => {
  let xml = "";
  const areaKeys = Object.keys(areas);
  if (paperSize) {
    areaKeys.map((area) => {
      xml += `<align mode="left"><text-line>${area}:</text-line>${lineFeed}</align>${formatAreaProduct(
        areas[area]
      )} <align mode="center">
    <text-line size="0:0">${padFillString(
      printerPaperSize[paperSize ?? 0].characters
    )}</text-line>${lineFeed}    
  </align>`;
    });

    return xml;
  }
};
export const formatCurrency = (currency: any[]) => {
  let xml = "";
  if (paperSize) {
    currency.map(({ name, amount }: any) => {
      const text = `A pagar en ${name}`;
      xml += `<text-line>${padBackString(
        text,
        printerPaperSize[paperSize].productName
      )}$${padFrontString(
        amount.toFixed(2),
        printerPaperSize[paperSize].productPrice
      )}</text-line>${lineFeed}`;
    });
    return xml;
  }
};
export const formatTaxesStatus = (taxes: any) => {
  let taxesArray: string[] = []; // Array para acumular las líneas
  const taxesKey = Object.keys(taxes);
  if (paperSize) {
    taxesKey.forEach((tax: any) => {
      const _tax = `${padBackString(
        `-${tax}:`,
        printerPaperSize[paperSize ?? 0].productName
      )}`;
      let amount = `$${padFrontString(
        taxes[tax].toFixed(2),
        printerPaperSize[paperSize].productPrice
      )}`;

      // Verificamos si la línea completa cabe en printerPaperSize[paperSize].breakLine caracteres
      if (_tax.length <= printerPaperSize[paperSize].breakLine) {
        taxesArray.push(
          `<text-line>${padBackString(
            _tax,
            printerPaperSize[paperSize].productName
          )}${amount}</text-line>${lineFeed}`
        );
      } else {
        // Si no cabe, lo dividimos en múltiples líneas
        const words = _tax.split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];

          // Verificamos si añadir la palabra actual excede los printerPaperSize[paperSize].breakLine caracteres
          if (
            (currentLine + " " + word).trim().length <=
            printerPaperSize[paperSize].breakLine
          ) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            // Si la línea actual está completa, la agregamos al array
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}</text-line>${lineFeed}`
            );
            currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
          }

          // Si es la última palabra, añadimos la línea final con el monto
          if (i === words.length - 1) {
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}${amount}</text-line>${lineFeed}`
            );
          }
        }
      }
    });

    return taxesArray.join("");
  }
};
export const formatMoney = (money: any) => {
  let taxesArray: string[] = []; // Array para acumular las líneas
  const taxesKey = Object.keys(money);
  if (paperSize) {
    taxesKey.forEach((currency: any) => {
      const _tax = `-${currency}:`;
      let amount = `$${padFrontString(
        (money[currency] ?? 0).toFixed(2),
        printerPaperSize[paperSize].productPrice
      )}`;

      // Verificamos si la línea completa cabe en printerPaperSize[paperSize].breakLine caracteres
      if (_tax.length <= printerPaperSize[paperSize].breakLine) {
        taxesArray.push(
          `<text-line>${padBackString(
            _tax,
            printerPaperSize[paperSize].productName
          )}${amount}</text-line>${lineFeed}`
        );
      } else {
        // Si no cabe, lo dividimos en múltiples líneas
        const words = _tax.split(" ");
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
          let word = words[i];

          // Verificamos si añadir la palabra actual excede los printerPaperSize[paperSize].breakLine caracteres
          if (
            (currentLine + " " + word).trim().length <=
            printerPaperSize[paperSize].breakLine
          ) {
            currentLine += (currentLine ? " " : "") + word;
          } else {
            // Si la línea actual está completa, la agregamos al array
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}</text-line>${lineFeed}`
            );
            currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
          }

          // Si es la última palabra, añadimos la línea final con el monto
          if (i === words.length - 1) {
            taxesArray.push(
              `<text-line>${padBackString(
                currentLine,
                printerPaperSize[paperSize].productName
              )}${amount}</text-line>${lineFeed}`
            );
          }
        }
      }
    });

    return taxesArray.join("");
  }
};
