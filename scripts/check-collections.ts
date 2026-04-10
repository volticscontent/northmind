import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCollections() {
  const collections = await prisma.produto.findMany({
    select: { collection: true },
    distinct: ['collection']
  });
  
  console.log("Existing Collections:", collections.map(c => c.collection));
  
  const specialPromoCount = await prisma.produto.count({
    where: { collection: { contains: "Special Promo", mode: "insensitive" } }
  });
  
  console.log(`Products in Special Promo: ${specialPromoCount}`);
  
  await prisma.$disconnect();
}

checkCollections();
