import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting final launch of the Fragrances collection...");

  // Part 1: Calculate averages from other products
  console.log("📊 Calculating averages from other collections...");
  const stats = await prisma.produto.aggregate({
    where: {
      NOT: [
        { collection: { contains: 'fragrance', mode: 'insensitive' } },
        { collection: { contains: 'perfume', mode: 'insensitive' } }
      ]
    },
    _avg: {
      totalAvaliacoes: true,
      mediaAvaliacoes: true
    }
  });

  const avgTotal = Math.round(stats._avg.totalAvaliacoes || 150);
  const avgMedia = Number((stats._avg.mediaAvaliacoes || 4.9).toFixed(1));

  console.log(`📈 Store Averages - Total Reviews: ${avgTotal}, Rating: ${avgMedia}`);

  // Part 2: Upsert the "Fragrances" collection
  console.log("📁 Ensuring 'Fragrances' collection exists...");
  const collection = await prisma.collection.upsert({
    where: { handle: 'fragrances' },
    update: {
      name: 'Fragrances',
      description: 'Premium heritage fragrance collection. North Mind Noir.',
      image: '/collections/fragrances.png' // Recommended banner path
    },
    create: {
      name: 'Fragrances',
      handle: 'fragrances',
      description: 'Premium heritage fragrance collection. North Mind Noir.',
      image: '/collections/fragrances.png'
    }
  });
  console.log(`✅ Collection ${collection.name} is ready.`);

  // Part 3: Update fragrance products with the averages
  console.log("✨ Synchronizing ratings for fragrance products...");
  const { count } = await prisma.produto.updateMany({
    where: {
      OR: [
        { collection: { contains: 'fragrance', mode: 'insensitive' } },
        { collection: { contains: 'perfume', mode: 'insensitive' } }
      ]
    },
    data: {
      totalAvaliacoes: avgTotal,
      mediaAvaliacoes: avgMedia
    }
  });

  console.log(`✅ Updated ratings for ${count} fragrance products.`);
  console.log("\n🎊 Fragrances collection launch completed successfully!");
}

main()
  .catch(e => {
    console.error("❌ Error during launch:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
