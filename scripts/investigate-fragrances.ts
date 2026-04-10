import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function investigateFragrances() {
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } },
        { nome: { contains: "eau de parfum", mode: "insensitive" } },
        { nome: { contains: "perfume", mode: "insensitive" } }
      ]
    },
    select: {
      id: true,
      nome: true,
      collection: true,
      fotoPrincipal: true,
      fotos: true
    }
  });

  console.log(`Found ${products.length} potential fragrance products.`);
  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}

investigateFragrances();
