import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏺 Categorizing existing products...");

  const fragrancesCount = await prisma.produto.updateMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "3x1", mode: "insensitive" } }
      ]
    },
    data: {
        tipo: "PERFUME"
    } as any
  });

  console.log(`✅ Successfully categorized ${fragrancesCount.count} products as PERFUME.`);
  
  const clothingCount = await prisma.produto.updateMany({
    where: {
      NOT: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "3x1", mode: "insensitive" } }
      ]
    },
    data: {
        tipo: "ROUPA"
    } as any
  });

  console.log(`✅ Successfully categorized ${clothingCount.count} products as ROUPA.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
