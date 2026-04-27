import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Publishing all products and collections...");

  const productResult = await prisma.produto.updateMany({
    data: {
      publicado: true,
    },
  });

  let collectionCount = 0;
  try {
    // Collection.publicado might exist in some databases even if schema is out of sync.
    const result = await prisma.$executeRawUnsafe(
      'UPDATE "public"."Collection" SET "publicado" = true WHERE "publicado" IS DISTINCT FROM true'
    );
    collectionCount = typeof result === "number" ? result : 0;
  } catch (error: any) {
    console.warn("Skipping collection publication update (column may not exist).");
    if (error?.message) {
      console.warn(error.message);
    }
  }

  console.log(`Products published: ${productResult.count}`);
  console.log(`Collections published: ${collectionCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
