import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

const NEW_SALE_PRICE = 89.99;
const NEW_ORIGINAL_PRICE = 189.99;

async function main() {
  console.log("🚀 Starting price update for Fragrance Sets...");
  console.log(`💰 New Sale Price: £${NEW_SALE_PRICE}`);
  console.log(`💰 New Original Price: £${NEW_ORIGINAL_PRICE}`);

  // Find products in 'Fragrance Sets' collection
  // Based on unified_products_en_gbp.json, it seems the category is 'Fragrance Sets'
  // and the handle is 'fragrance-sets'. In schema.prisma, the field is 'collection'.
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { equals: 'Fragrance Sets', mode: 'insensitive' } },
        { collection: { equals: 'fragrance-sets', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`🔍 Found ${products.length} products to update in Fragrance Sets.`);

  if (products.length === 0) {
    console.log("⚠️ No products found. Checking all collections to help debug...");
    const allCollections = await prisma.produto.findMany({
      select: { collection: true },
      distinct: ['collection']
    });
    console.log("Distinct collections in DB:", allCollections.map(c => c.collection));
    return;
  }

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

    console.log(`✅ Updated: ${product.nome} (Collection: ${product.collection})`);
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
