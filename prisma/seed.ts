import { PrismaClient } from "@prisma/client";
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
    data: { denomination: "Categorias", details: "Categorías de las ofertas" },
  });
  const tipoCuenta = await prisma.concept.create({
    data: {
      denomination: "Tipo de cuenta",
      details: "Categorías de las ofertas",
    },
  });
  const area = await prisma.concept.create({
    data: { denomination: "Areas", details: "Categorías de las ofertas" },
  });
  const divisa = await prisma.concept.create({
    data: { denomination: "Divisas", details: "Categorías de las ofertas" },
  });
  const tipoPago = await prisma.concept.create({
    data: {
      denomination: "Tipos de pago",
      details: "Categorías de las ofertas",
    },
  });
  const estadoCuenta = await prisma.concept.create({
    data: {
      denomination: "Estado cuenta",
      details: "Categorías de las ofertas",
    },
  });
  const mainCategories = await prisma.concept.createMany({
    data: [
      {
        denomination: "Bebidas",
        details: "Variedad de bebidas",
        fatherId: categoria.id,
      },
      {
        denomination: "Entrantes",
        details: "Pequeñas porciones para empezar",
        fatherId: categoria.id,
      },
      {
        denomination: "Sopas",
        details: "Deliciosas opciones líquidas",
        fatherId: categoria.id,
      },
      {
        denomination: "Ensaladas",
        details: "Frescas mezclas de verduras y más",
        fatherId: categoria.id,
      },
      {
        denomination: "Platos Fuertes",
        details: "Opciones principales del menú",
        fatherId: categoria.id,
      },
      {
        denomination: "Postres",
        details: "Dulces delicias para terminar",
        fatherId: categoria.id,
      },
    ],
  });
  const mainTipoCuenta = await prisma.concept.createMany({
    data: [
      {
        denomination: "Cuenta local",
        details: "Variedad de bebidas",
        fatherId: tipoCuenta.id,
      },
      {
        denomination: "Para llevar",
        details: "Pequeñas porciones para empezar",
        fatherId: tipoCuenta.id,
      },
      {
        denomination: "Cuenta casa",
        details: "Deliciosas opciones líquidas",
        fatherId: tipoCuenta.id,
      },
    ],
  });
  const mainAreas = await prisma.concept.createMany({
    data: [
      {
        denomination: "Barra",
        details: "Área para servir bebidas y aperitivos",
        fatherId: area.id,
      },
      {
        denomination: "Salón",
        details: "Área principal para servicio al cliente",
        fatherId: area.id,
      },
      {
        denomination: "Cocina",
        details: "Área donde se preparan los alimentos",
        fatherId: area.id,
      },
    ],
  });
  const mainDivisas = await prisma.concept.createMany({
    data: [
      {
        denomination: "USD",
        details: "Dólares americanos",
        fatherId: divisa.id,
      },
      {
        denomination: "EUR",
        details: "Euros",
        fatherId: divisa.id,
      },
      {
        denomination: "MLC",
        details: "Moneda libremente convertible",
        fatherId: divisa.id,
      },
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
        denomination: "Divisa",
        details: "Distintos tipos",
        fatherId: tipoPago.id,
      },
      {
        denomination: "MLC",
        details: "Por transferencia",
        fatherId: tipoPago.id,
      },
      {
        denomination: "Transferencia",
        details: "CUP",
        fatherId: tipoPago.id,
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
