import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.produto.findMany({
    take: 3,
    where: {
      NOT: {
        collection: { contains: "fragrance", mode: "insensitive" }
      }
    },
    select: {
      nome: true,
      opcoesTamanho: true,
      variantes: true
    } as any
  });

  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}

checkProducts();
