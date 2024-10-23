export function padFrontString(input: any, pad: number) {
  while (input.toString().length < pad) {
    input = " " + input; // Añade un espacio al principio
  }
  return input;
}
export function padBackString(input: any, pad: number) {
  while (input.toString().length < pad) {
    input = input + " "; // Añade un espacio al principio
  }
  return input;
}
export const formatProducts = (products: any[]) => {
  let productsArray: string[] = []; // Array para acumular las líneas

  products.forEach((order) => {
    const _order = `${order.count} ${order.product}`;
    let price = `$${padFrontString(order.price.toFixed(2), 11)}`;

    // Verificamos si la línea completa con el precio cabe en 19 caracteres
    if (_order.length <= 19) {
      productsArray.push(
        `<text-line>${padBackString(_order, 20)}${price}</text-line>`
      );
    } else {
      // Si no cabe, lo dividimos en múltiples líneas
      const words = _order.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Verificamos si añadir la palabra actual excede los 19 caracteres
        if ((currentLine + " " + word).trim().length <= 19) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          // Si la línea actual está completa, la agregamos al array
          productsArray.push(
            `<text-line>${padBackString(currentLine, 20)}</text-line>`
          );
          currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
        }

        // Si es la última palabra, añadimos la línea final con el precio
        if (i === words.length - 1) {
          productsArray.push(
            `<text-line>${padBackString(currentLine, 20)}${price}</text-line>`
          );
        }
      }
    }
  });

  return productsArray.join("");
};
export const formatAreaProduct = (products: any[]) => {
  let productsArray: string[] = []; // Array para acumular las líneas

  products.forEach((product) => {
    let name = `${product.offerName}:`;

    // Verificamos si la línea completa con el precio cabe en 19 caracteres
    if (name.length <= 19) {
      productsArray.push(
        `<text-line>${padBackString(name, 20)}${padFrontString(
          product.totalQuantity,
          11
        )}</text-line>`
      );
    } else {
      // Si no cabe, lo dividimos en múltiples líneas
      const words = name.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Verificamos si añadir la palabra actual excede los 19 caracteres
        if ((currentLine + " " + word).trim().length <= 19) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          // Si la línea actual está completa, la agregamos al array
          productsArray.push(
            `<text-line>${padBackString(currentLine, 20)}</text-line>`
          );
          currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
        }

        // Si es la última palabra, añadimos la línea final con el precio
        if (i === words.length - 1) {
          productsArray.push(
            `<text-line>${padBackString(currentLine, 20)}${padFrontString(
              product.totalQuantity,
              11
            )}</text-line>`
          );
        }
      }
    }
  });

  return productsArray.join("");
};
export const formatTaxes = (taxes: any[]) => {
  let taxesArray: string[] = []; // Array para acumular las líneas

  taxes.forEach((tax: any) => {
    const _tax = `${tax.name} (${!tax.tax ? "-" : ""}${tax.percent}%)`;
    let amount = `$${padFrontString(tax.amount.toFixed(2), 11)}`;

    // Verificamos si la línea completa cabe en 19 caracteres
    if (_tax.length <= 19) {
      taxesArray.push(
        `<text-line>${padBackString(_tax, 20)}${amount}</text-line>`
      );
    } else {
      // Si no cabe, lo dividimos en múltiples líneas
      const words = _tax.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Verificamos si añadir la palabra actual excede los 19 caracteres
        if ((currentLine + " " + word).trim().length <= 19) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          // Si la línea actual está completa, la agregamos al array
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}</text-line>`
          );
          currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
        }

        // Si es la última palabra, añadimos la línea final con el monto
        if (i === words.length - 1) {
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}${amount}</text-line>`
          );
        }
      }
    }
  });

  return taxesArray.join("");
};
export const formatAreas = (areas: any) => {
  let xml = "";
  const areaKeys = Object.keys(areas);
  console.log(areaKeys);
  areaKeys.map((area) => {
    xml += `<align mode="left"><text-line>${area}:</text-line></align>${formatAreaProduct(
      areas[area]
    )}<align mode="center"><text-line size="0:0">- - - - - - - - - - - - - - - -</text-line></align>`;
  });

  return xml;
};
export const formatCurrency = (currency: any[]) => {
  let xml = "";
  currency.map(({ name, amount }: any) => {
    const text = `A pagar en ${name}`;
    xml += `<text-line>${padBackString(text, 20)}$${padFrontString(
      Number(amount).toFixed(2),
      11
    )}</text-line>`;
  });
  return xml;
};
export const formatTaxesStatus = (taxes: any) => {
  let taxesArray: string[] = []; // Array para acumular las líneas
  const taxesKey = Object.keys(taxes);

  taxesKey.forEach((tax: any) => {
    const _tax = ` -${tax}:`;
    let amount = `$${padFrontString(taxes[tax].toFixed(2), 11)}`;

    // Verificamos si la línea completa cabe en 19 caracteres
    if (_tax.length <= 19) {
      taxesArray.push(
        `<text-line>${padBackString(_tax, 20)}${amount}</text-line>`
      );
    } else {
      // Si no cabe, lo dividimos en múltiples líneas
      const words = _tax.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Verificamos si añadir la palabra actual excede los 19 caracteres
        if ((currentLine + " " + word).trim().length <= 19) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          // Si la línea actual está completa, la agregamos al array
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}</text-line>`
          );
          currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
        }

        // Si es la última palabra, añadimos la línea final con el monto
        if (i === words.length - 1) {
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}${amount}</text-line>`
          );
        }
      }
    }
  });

  return taxesArray.join("");
};
export const formatMoney = (money: any) => {
  let taxesArray: string[] = []; // Array para acumular las líneas
  const taxesKey = Object.keys(money);

  taxesKey.forEach((currency: any) => {
    const _tax = `-${currency}:`;
    let amount = `$${padFrontString(money[currency].toFixed(2), 11)}`;

    // Verificamos si la línea completa cabe en 19 caracteres
    if (_tax.length <= 19) {
      taxesArray.push(
        `<text-line>${padBackString(_tax, 20)}${amount}</text-line>`
      );
    } else {
      // Si no cabe, lo dividimos en múltiples líneas
      const words = _tax.split(" ");
      let currentLine = "";

      for (let i = 0; i < words.length; i++) {
        let word = words[i];

        // Verificamos si añadir la palabra actual excede los 19 caracteres
        if ((currentLine + " " + word).trim().length <= 19) {
          currentLine += (currentLine ? " " : "") + word;
        } else {
          // Si la línea actual está completa, la agregamos al array
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}</text-line>`
          );
          currentLine = word; // Iniciamos una nueva línea con la palabra que no cabía
        }

        // Si es la última palabra, añadimos la línea final con el monto
        if (i === words.length - 1) {
          taxesArray.push(
            `<text-line>${padBackString(currentLine, 20)}${amount}</text-line>`
          );
        }
      }
    }
  });

  return taxesArray.join("");
};
