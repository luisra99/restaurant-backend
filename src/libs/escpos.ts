const usb = require("usb");
import { EscPos } from "@tillpos/xml-escpos-helper";

const escpos = require("escpos");
escpos.USB = require("escpos-usb");

export const print = (data: any, model: any) => {
  const xml = model(data);
  const buffer = EscPos.getBufferFromXML(xml);
  imprimir(buffer);
};

function imprimir(buffer: any) {
  const devices = escpos.USB.findPrinter();
  // console.log(devices);
  const device = usb.findByIds(4070, 33054);
  if (device) {
    device.open();
    const iface = device.interfaces?.[0];
    iface?.claim();
    const endpoint: any = iface?.endpoints[0];
    endpoint?.transfer?.(buffer, (error: any) => {
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
}
