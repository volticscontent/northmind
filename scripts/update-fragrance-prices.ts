import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

const NEW_SALE_PRICE = 39.99;
const NEW_ORIGINAL_PRICE = 69.99;

async function main() {
  console.log("🚀 Starting global price update for fragrances...");
  console.log(`💰 New Sale Price: $${NEW_SALE_PRICE}`);
  console.log(`💰 New Original Price: $${NEW_ORIGINAL_PRICE}`);

  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: 'fragrance', mode: 'insensitive' } },
        { collection: { contains: 'perfume', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`🔍 Found ${products.length} products to update.`);

  let updatedCount = 0;

  for (const product of products) {
    // Update variants if they exist
    let updatedVariants = null;
    if (product.variantes && Array.isArray(product.variantes)) {
      updatedVariants = (product.variantes as any[]).map(v => ({
        ...v,
        price: NEW_SALE_PRICE,
        originalPrice: NEW_ORIGINAL_PRICE
      }));
    }

    await prisma.produto.update({
      where: { id: product.id },
      data: {
        preco: NEW_SALE_PRICE,
        precoOriginal: NEW_ORIGINAL_PRICE,
        variantes: updatedVariants || undefined
      }
    });

    console.log(`✅ Updated: ${product.nome}`);
    updatedCount++;
  }

  console.log("\n✨ Price update finished!");
  console.log(`📈 Total products updated: ${updatedCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
