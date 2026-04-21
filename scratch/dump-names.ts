import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.produto.findMany({
    select: { nome: true }
  });
  console.log(JSON.stringify(products.map(p => p.nome), null, 2));
}

main().finally(() => prisma.$disconnect());
