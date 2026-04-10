import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkProducts() {
  const products = await prisma.produto.findMany({
    take: 5,
    where: {
      NOT: {
        collection: { contains: "fragrance", mode: "insensitive" }
      }
    }
  });

  console.log(JSON.stringify(products, null, 2));
  await prisma.$disconnect();
}

checkProducts();
