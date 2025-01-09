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
      details: "Las disitintas formas de las que se retira dinero de la caja",
    },
  });
  const mainConceptoIngreso = await prisma.concept.create({
    data: {
      denomination: "Concepto de retiro",
      details: "Las disitintas formas de las que se retira dinero de la caja",
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
    ],
  });
  const conceptosIngreso = await prisma.concept.createMany({
    data: [
      { denomination: "Propina", fatherId: mainConceptoIngreso.id },
      { denomination: "Fondo", fatherId: mainConceptoIngreso.id },
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

  const actions = await prisma.permission.createMany({
    data: seedPermissions,
  });
  const hashedPassword = await bcrypt.hash("1234", 10);

  const rootUser = await prisma.user.create({
    data: {
      username: "admin",
      password: hashedPassword,
      permissions: {
        create: (await prisma.permission.findMany()).map(({ id }: any) => ({
          permission: {
            connect: { id, }
          }
        }))
      }
    }
  })

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
