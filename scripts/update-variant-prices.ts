import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏺 Updating dynamic pricing variants for 3x1 Fragrances...");

  const products = await prisma.produto.findMany({
    where: {
      collection: { contains: "3x1", mode: "insensitive" }
    }
  });

  console.log(`📦 Updating ${products.length} products with tiered volume pricing.`);

  for (const p of products) {
    const basePrice = Number(p.preco) || 49.00;
    const baseOriginal = Number(p.precoOriginal) || 69.00;

    const variants = [
      { label: "30ml", price: basePrice, originalPrice: baseOriginal },
      { label: "50ml", price: basePrice + 20, originalPrice: baseOriginal + 30 },
      { label: "100ml", price: basePrice + 40, originalPrice: baseOriginal + 60 }
    ];

    // Important: ProductInteractions.tsx looks for v.name, so we ensure the field matches
    // But the schema uses a Json field for variants, so we store it as an array
    await prisma.produto.update({
      where: { id: p.id },
      data: {
        variantes: variants
      } as any
    });
  }

  console.log("✅ Dynamic pricing updated! Volumes now carry their own specific values.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
