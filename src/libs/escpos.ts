const usb = require("usb");
import { EscPos } from "@tillpos/xml-escpos-helper";

const escpos = require("escpos");
escpos.USB = require("escpos-usb");

export const print = (data: any, model: any) => {
  const xml = model(data);
  const normalizedData = JSON.parse(
    JSON.stringify(xml)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
  const buffer = EscPos.getBufferFromXML(normalizedData);
  imprimir(buffer);
  return xml;
};

function imprimir(buffer: any) {
  try {
    const devices = escpos.USB.findPrinter();
    console.log(devices);
    console.log(process.env.VENDOR, process.env.PRODUCT);
    const device = usb.findByIds(
      Number(process.env.VENDOR),
      Number(process.env.PRODUCT)
    );
    if (device) {
      device.open();
      const iface = device.interfaces?.[0];
      iface?.claim();
      const endpoint: any = iface?.endpoints[Number(process.env.INTERFACE)];
      endpoint?.transferAsync?.(buffer, (error: any) => {
        if (error) {
          console.error("Error al enviar datos a la impresora:", error);
        } else {
          console.log("Etiqueta impresa correctamente.");
        }
        device.close();
      });
      const saltosDeLinea = Buffer.alloc(2, 0x0a);
      endpoint?.transfer?.(saltosDeLinea, (error: any) => {
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
  } catch (error) {
    console.log(error);
  }
}
