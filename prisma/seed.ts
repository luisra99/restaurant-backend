import { Prisma, PrismaClient } from "@prisma/client";
import { seedPermissions } from "./actions.seed";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

// Estados del Sistema
// Cuentas activas: Cuentas que están abiertas y recibiendo pedidos.
// Cuentas cerradas: Cuentas que ya han sido pagadas y cerradas.
// Pedidos pendientes: Pedidos que han sido tomados, pero aún no se han servido o cerrado.
// Pedidos servidos: Pedidos que han sido servidos pero aún no han sido facturados o pagados.
// Áreas operativas: Diferentes áreas del restaurante que están activas y registrando cuentas.
// Ofertas disponibles: Productos y servicios que están disponibles para ser consumidos por los clientes.
// Ofertas agotadas: Productos que ya no están disponibles debido a la falta de stock (si decides implementar inventario).
// Pagos realizados: Pagos que ya han sido procesados en una cuenta cerrada.
// Métodos de pago diferentes: Pagos procesados con diferentes métodos como efectivo, tarjeta, etc.

// Resumen de los Estados Probados:
// Cuentas activas y cuentas cerradas.
// Pedidos pendientes y pedidos servidos.
// Áreas del restaurante activas.
// Ofertas disponibles y agotadas.
// Pagos procesados con diferentes métodos (efectivo y tarjeta).
// Control de inventario (disponible y agotado).

async function main() {
  // Seed data for Concepts
  const categoria = await prisma.concept.create({
    data: { denomination: "Categorías", details: "Categorías de las ofertas" },
  });
  const area = await prisma.concept.create({
    data: {
      denomination: "Áreas",
      details: "Area de elaboración de la ofertas",
    },
  });
  const tipoCuenta = await prisma.concept.create({
    data: {
      denomination: "Tipo de cuenta",
    },
  });
  const tipoPago = await prisma.concept.create({
    data: {
      denomination: "Tipos de pago",
    },
  });
  const estadoCuenta = await prisma.concept.create({
    data: {
      denomination: "Estado de la cuenta",
    },
  });
  const divisa = await prisma.concept.create({
    data: {
      denomination: "Divisas",
    },
  });
  const mainConceptoRetiro = await prisma.concept.create({
    data: {
      denomination: "Concepto de retiro",
      details: "Las distintas formas de las que se retira dinero de la caja",
    },
  });
  const mainConceptoIngreso = await prisma.concept.create({
    data: {
      denomination: "Concepto de ingreso",
      details: "Las distintas formas de las que se retira dinero de la caja",
    },
  });

  const mainTipoCuenta = await prisma.concept.createMany({
    data: [
      {
        denomination: "Cuenta Normal",
        fatherId: tipoCuenta.id,
      },
      {
        denomination: "Cuenta Casa",
        fatherId: tipoCuenta.id,
      },
      {
        denomination: "Para llevar",
        fatherId: tipoCuenta.id,
      },
    ],
  });
  const mainEstadoCuenta = await prisma.concept.createMany({
    data: [
      {
        denomination: "Abierta",
        details: "La cuenta esta en uso",
        fatherId: estadoCuenta.id,
      },
      {
        denomination: "Cerrada",
        details: "La cuenta esta terminada",
        fatherId: estadoCuenta.id,
      },
    ],
  });

  const conceptosRetiro = await prisma.concept.createMany({
    data: [
      { denomination: "Cambio", fatherId: mainConceptoRetiro.id },
      { denomination: "Extracción", fatherId: mainConceptoRetiro.id },
      { denomination: "Pago", fatherId: mainConceptoRetiro.id },
      { denomination: "Devolución", fatherId: mainConceptoRetiro.id },
      { denomination: "Merma", fatherId: mainConceptoRetiro.id },
    ],
  });
  const conceptosIngreso = await prisma.concept.createMany({
    data: [
      { denomination: "Propina", fatherId: mainConceptoIngreso.id },
      { denomination: "Fondo", fatherId: mainConceptoIngreso.id },
      { denomination: "Venta directa", fatherId: mainConceptoIngreso.id },
      { denomination: "Cobro", fatherId: mainConceptoIngreso.id },
      { denomination: "Inyección de capital", fatherId: mainConceptoIngreso.id },
    ],
  });
  const mainTipoPago = await prisma.concept.createMany({
    data: [
      {
        denomination: "Efectivo",
        details: "Pago normal en cup",
        fatherId: tipoPago.id,
      },
      {
        denomination: "Transferencia",
        details: "CUP",
        fatherId: tipoPago.id,
      },
    ],
  });

  const mainTipoMovimiento = await prisma.concept.create({
    data:
    {
      denomination: "Tipos de movimiento",
      details: "Distintos tipos de movimiento en el inventario",
    }
  });

  const mainMovimientos = await prisma.concept.createMany({
    data: [
      {
        denomination: "Entrada",
        details: "Llegada de un producto a un área",
        fatherId: mainTipoMovimiento.id,
      },
      {
        denomination: "Salida",
        details: "Salida de un producto a un área",
        fatherId: mainTipoMovimiento.id,
      },
      {
        denomination: "Traslado",
        details: "Movimiento de un producto a un área",
        fatherId: mainTipoMovimiento.id,
      },
      {
        denomination: "Venta Directa",
        details: "Movimiento de un producto a un área",
        fatherId: mainTipoMovimiento.id,
      },
      {
        denomination: "Merma",
        details: "Salida de un producto por afectación o vencimiento",
        fatherId: mainTipoMovimiento.id,
      },
    ],
  });
  const actions = await prisma.permission.createMany({
    data: seedPermissions,
  });
  const hashedPassword = await bcrypt.hash("1234", 10);

  const rootUser = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      idRole: "Admin",
      permissions: {
        create: (await prisma.permission.findMany()).map(({ id }: any) => ({
          permission: {
            connect: { id, }
          }
        }))
      }
    }
  })

  // Insertar las unidades de medida en la base de datos
  await prisma.unitOfMeasure.createMany({
    data: [
      {
        "name": "Miligramo",
        "abbreviation": "mg",
        "type": "Masa",
        "factor": { "mg": 1, "g": 0.001, "kg": 0.000001, "t": 0.000000001 }
      },
      {
        "name": "Gramo",
        "abbreviation": "g",
        "type": "Masa",
        "factor": { "mg": 1000, "g": 1, "kg": 0.001, "t": 0.000001 }
      },
      {
        "name": "Kilogramo",
        "abbreviation": "kg",
        "type": "Masa",
        "factor": { "mg": 1000000, "g": 1000, "kg": 1, "t": 0.001 }
      },
      {
        "name": "Tonelada",
        "abbreviation": "t",
        "type": "Masa",
        "factor": { "mg": 1000000000, "g": 1000000, "kg": 1000, "t": 1 }
      },
      {
        "name": "Mililitro",
        "abbreviation": "mL",
        "type": "Volumen",
        "factor": { "mL": 1, "L": 0.001 }
      },
      {
        "name": "Litro",
        "abbreviation": "L",
        "type": "Volumen",
        "factor": { "mL": 1000, "L": 1 }
      },
      {
        "name": "Milímetro",
        "abbreviation": "mm",
        "type": "Distancia",
        "factor": { "mm": 1, "cm": 0.1, "dm": 0.01, "m": 0.001, "km": 0.000001 }
      },
      {
        "name": "Centímetro",
        "abbreviation": "cm",
        "type": "Distancia",
        "factor": { "mm": 10, "cm": 1, "dm": 0.1, "m": 0.01, "km": 0.00001 }
      },
      {
        "name": "Decímetro",
        "abbreviation": "dm",
        "type": "Distancia",
        "factor": { "mm": 100, "cm": 10, "dm": 1, "m": 0.1, "km": 0.0001 }
      },
      {
        "name": "Metro",
        "abbreviation": "m",
        "type": "Distancia",
        "factor": { "mm": 1000, "cm": 100, "dm": 10, "m": 1, "km": 0.001 }
      },
      {
        "name": "Kilómetro",
        "abbreviation": "km",
        "type": "Distancia",
        "factor": { "mm": 1000000, "cm": 100000, "dm": 10000, "m": 1000, "km": 1 }
      },
      {
        "name": "Unidad",
        "abbreviation": "u",
        "type": "Unidades",
        "factor": { "u": 1, "dec": 10, "cen": 100, "mill": 1000 }
      },
      {
        "name": "Decena",
        "abbreviation": "dec",
        "type": "Unidades",
        "factor": { "u": 0.1, "dec": 1, "cen": 10, "mill": 100 }
      },
      {
        "name": "Centena",
        "abbreviation": "cen",
        "type": "Unidades",
        "factor": { "u": 0.01, "dec": 0.1, "cen": 1, "mill": 10 }
      },
      {
        "name": "Millar",
        "abbreviation": "mill",
        "type": "Unidades",
        "factor": { "u": 0.001, "dec": 0.01, "cen": 0.1, "mill": 1 }
      }
    ]
  });
  const guest = await prisma.role.create({
    data: { name: "INVITADO" }
  });

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
