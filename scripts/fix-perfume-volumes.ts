import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏺 Standardizing volumes for all PERFUME assets...");

  const defaultFragranceSizes = ["30ml", "50ml", "100ml"];

  const updatedCount = await prisma.produto.updateMany({
    where: {
      tipo: "PERFUME",
      OR: [
        { opcoesTamanho: { has: "S" } },
        { opcoesTamanho: { has: "M" } },
        { opcoesTamanho: { has: "L" } },
        { opcoesTamanho: { equals: [] } }
      ]
    },
    data: {
      opcoesTamanho: defaultFragranceSizes
    }
  });

  console.log(`✅ Successfully updated ${updatedCount.count} perfumes with ML volumes instead of clothing sizes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
