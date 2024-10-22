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
    data: { denomination: "Categorías", details: "Categorías de las ofertas" },
  });
  const tipoCuenta = await prisma.concept.create({
    data: {
      denomination: "Tipo de cuenta",
      details: "Categorías de las ofertas",
    },
  });
  const area = await prisma.concept.create({
    data: { denomination: "Áreas", details: "Categorías de las ofertas" },
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
  const divisasConcept = await prisma.concept.create({
    data: {
      denomination: "Divisas",
      details: "Tipos de divisas o monedas utilizadas en transacciones.",
      childConcept: {
        create: [
          { denomination: "USD", details: "320" },
          { denomination: "EUR", details: "330" },
          { denomination: "MLC", details: "270" },
        ],
      },
    },
  });
  const mainConceptoRetiro = await prisma.concept.create({
    data: {
      denomination: "Concepto de retiro",
      details: "Las disitintas formas de las que se retira dinero de la caja",
    },
  });
  const conceptosRetiro = await prisma.concept.create({
    data: { denomination: "Cambio", fatherId: mainConceptoRetiro.id },
  });
  const bebidas = await prisma.concept.create({
    data: {
      denomination: "Bebidas",
      details: "Variedad de bebidas",
      fatherId: categoria.id,
    },
  });

  const entrantes = await prisma.concept.create({
    data: {
      denomination: "Entrantes",
      details: "Pequeñas porciones para empezar",
      fatherId: categoria.id,
    },
  });

  const sopas = await prisma.concept.create({
    data: {
      denomination: "Sopas",
      details: "Deliciosas opciones líquidas",
      fatherId: categoria.id,
    },
  });

  const ensaladas = await prisma.concept.create({
    data: {
      denomination: "Ensaladas",
      details: "Frescas mezclas de verduras y más",
      fatherId: categoria.id,
    },
  });

  const platosFuertes = await prisma.concept.create({
    data: {
      denomination: "Platos Fuertes",
      details: "Opciones principales del menú",
      fatherId: categoria.id,
    },
  });

  const postres = await prisma.concept.create({
    data: {
      denomination: "Postres",
      details: "Dulces delicias para terminar",
      fatherId: categoria.id,
    },
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
  const barra = await prisma.concept.create({
    data: {
      denomination: "Barra",
      details: "Área para servir bebidas y aperitivos",
      fatherId: area.id,
    },
  });

  const salon = await prisma.concept.create({
    data: {
      denomination: "Salón",
      details: "Área principal para servicio al cliente",
      fatherId: area.id,
    },
  });

  const cocina = await prisma.concept.create({
    data: {
      denomination: "Cocina",
      details: "Área donde se preparan los alimentos",
      fatherId: area.id,
    },
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
  const mainDiscount = await prisma.taxDiscounts.create({
    data: {
      name: "Impuesto por servicio",
      percent: 10,
      tax: true,
      status: true,
    },
  });
  const seedDiscount = await prisma.taxDiscounts.create({
    data: {
      name: "Descuento por cumpleaño",
      percent: 3,
      tax: false,
      status: false,
    },
  });
  const mainDependent = await prisma.dependent.createMany({
    data: [
      { name: "Adriana" },
      { name: "Diego" },
      { name: "Adans" },
      { name: "Lucho" },
    ],
  });
  const mainTable = await prisma.table.create({
    data: { name: "Mesa 1", details: "Vista al mar", capacity: 4 },
  });
  const tables = await prisma.table.createMany({
    data: [
      { name: "Mesa 2", details: "Terraza", capacity: 6 },
      { name: "Mesa 3", details: "Balcón", capacity: 2 },
      { name: "Mesa 4", details: "Reservado", capacity: 4 },
    ],
  });
  const mainOffer = await prisma.offer.create({
    data: {
      name: "Jugo natural",
      description: "Frutas de la temporada",
      price: 250,
      idArea: barra.id,
      idCategory: bebidas.id,
    },
  });
  const offers = await prisma.offer.createMany({
    data: [
      {
        name: "Pizza de queso",
        description: "Queso Gouda",
        price: 250,
        idArea: cocina.id,
        idCategory: entrantes.id,
      },
      {
        name: "Refresco de Cola",
        description: "Bebidas analcolicas",
        price: 250,
        idArea: barra.id,
        idCategory: bebidas.id,
      },
      {
        name: "Papas Fritas",
        description: "Plato de papas precocidas",
        price: 250,
        idArea: cocina.id,
        idCategory: entrantes.id,
      },
    ],
  });
  const mainAccount = await prisma.account.create({
    data: {
      name: "Raul",
      description: "El informatico",
      people: 3,
      taxDiscount: [mainDiscount.id],
      idTable: mainTable.id,
      details: { create: { quantity: 2, idOffer: mainOffer.id } },
    },
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
