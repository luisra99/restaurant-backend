const usb = require("usb");
import { EscPos } from "@tillpos/xml-escpos-helper";

const escpos = require("escpos");
escpos.USB = require("escpos-usb");

export const print = (data: any, model: any) => {
  try {
    const xml = model(data);
    const normalizedData = JSON.parse(
      JSON.stringify(xml)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    );
    const buffer = EscPos.getBufferFromXML(normalizedData);
    imprimir(buffer);
    return xml;
  } catch (error) {
    console.log(error);
    throw new Error("Error al enviar datos a la impresora.");
  }
};

export function imprimir(buffer: any) {
  const devices = escpos.USB.findPrinter();
  console.log("devices", devices);
  console.log(process.env.VENDOR, process.env.PRODUCT);
  try {
    const device = usb.findByIds(
      devices[0].deviceDescriptor.idVendor,
      devices[0].deviceDescriptor.idProduct
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
      const saltosDeLinea = Buffer.alloc(3, 0x0a);
      endpoint?.transfer?.(saltosDeLinea, (error: any) => {
        if (error) {
          console.error("Error al enviar datos a la impresora:", error);
        } else {
          console.log("Etiqueta impresa correctamente.");
        }
        device.close();
      });
      // Comando de corte de papel
      const comandoCorte = Buffer.from([0x1d, 0x56, 0x00]); // Comando ESC/POS para corte completo
      endpoint?.transfer?.(comandoCorte, (error: any) => {
        if (error) {
          console.error(
            "Error al enviar comando de corte a la impresora:",
            error
          );
        } else {
          console.log("Comando de corte enviado correctamente.");
        }
        device.close();
      });
    }
  } catch (error) {
    console.log(error);
  }
}
