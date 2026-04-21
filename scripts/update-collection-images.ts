import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting collection image update...");

  // Update Outerwear
  const outerwear = await prisma.collection.update({
    where: { handle: 'outerwear' },
    data: { image: '/collections/Outerwear.jpeg' }
  });
  console.log(`✅ Updated Outerwear image: ${outerwear.image}`);

  // Update Silent Warmth
  const silentWarmth = await prisma.collection.update({
    where: { handle: 'silent-warmth' },
    data: { image: '/collections/silent-warmth.jpeg' }
  });
  console.log(`✅ Updated Silent Warmth image: ${silentWarmth.image}`);

  console.log("\n✨ Collection images updated successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
