export function padFrontString(input: string, pad: number) {
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
  export function padBackString(input: string, pad: number) {
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
  export const formatProducts = (products:any[]) => {
    let productsArray: string[] = []; // Cambia a un array para acumular las líneas
    products.forEach((order) => {
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
  export const formatTaxes = (taxes:any[]) => {
    let taxesArray: string[] = []; // Cambia a un array para acumular las líneas
    taxes.forEach((tax:any) => {
      const _tax = `${tax.name} (${!tax.tax && "-"}${tax.percent})${tax.percent}%`;
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