import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });
const prisma = new PrismaClient();

async function main() {
  const collections = await prisma.collection.findMany();
  console.log(JSON.stringify(collections, null, 2));
}

main().finally(() => prisma.$disconnect());
