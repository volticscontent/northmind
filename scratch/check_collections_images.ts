import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

async function main() {
  const collections = await prisma.collection.findMany();
  console.log("Current Collections:", JSON.stringify(collections, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
