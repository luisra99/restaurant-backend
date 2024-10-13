import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
  const concept1 = await prisma.concept.create({
    data: { denomination: "Bebidas", details: "Categoría de bebidas" },
  })
  const concept2 = await prisma.concept.create({
    data: { denomination: "Comidas", details: "Categoría de comidas", fatherId: concept1.id },
  })

  // Seed data for Areas
  const area1 = await prisma.area.create({
    data: { name: "Salón Principal", description: "Área principal del restaurante", details: "Con capacidad para 50 personas", color: "#ffcc00" },
  })
  const area2 = await prisma.area.create({
    data: { name: "Terraza", description: "Área al aire libre", details: "Vista al mar", color: "#00ccff" },
  })

  // Seed data for Offers (Available)
  const offer1 = await prisma.offer.create({
    data: {
      name: "Pizza Margarita",
      description: "Pizza con queso mozzarella y tomate",
      price: 12.50,
      idType: concept2.id,
      details: "Tamaño mediano",
    },
  })
  const offer2 = await prisma.offer.create({
    data: {
      name: "Cerveza Artesanal",
      description: "Cerveza rubia de la casa",
      price: 5.00,
      idType: concept1.id,
      details: "500ml",
    },
  })

  // Seed data for Accounts (Active and Closed)
  const account1 = await prisma.account.create({
    data: {
      name: "Mesa 1",
      description: "Mesa en el salón principal",
      idArea: area1.id,
      active: true,
      subTotal: 17.50,
      total: 20.50,
      created: new Date(),
    },
  })

  const account2 = await prisma.account.create({
    data: {
      name: "Mesa 2",
      description: "Mesa en la terraza",
      idArea: area2.id,
      active: false, // Closed account
      subTotal: 10.00,
      total: 11.50,
      created: new Date(),
      closed: new Date(),
    },
  })

  // Seed data for Account Details (Pending and Served Orders)
  await prisma.accountDetails.create({
    data: {
      idAccount: account1.id,
      idOffer: offer1.id,
      time: new Date(),
      quantity: 2, // Pedido en progreso
    },
  })

  await prisma.accountDetails.create({
    data: {
      idAccount: account2.id,
      idOffer: offer2.id,
      time: new Date(),
      quantity: 1, // Pedido servido y cerrado
    },
  })

  // Seed data for Payments (Multiple Methods)
  await prisma.payment.create({
    data: {
      idAccount: account2.id,
      amount: 11.50,
      method: "Efectivo", // Pago realizado en efectivo
      date: new Date(),
    },
  })

  await prisma.payment.create({
    data: {
      idAccount: account1.id,
      amount: 20.50,
      method: "Tarjeta", // Pago en proceso por tarjeta
      date: new Date(),
    },
  })

  // Seed data for Inventory (Stock and Out of Stock)
  await prisma.inventory.create({
    data: {
      name: "Cerveza Artesanal",
      stock: 50,
      price: 5.00,
      offerId: offer2.id,
    },
  })

  await prisma.inventory.create({
    data: {
      name: "Pizza Margarita",
      stock: 0, // Agotado
      price: 12.50,
      offerId: offer1.id,
    },
  })

  console.log("Seed data created successfully!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
