import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: 'fragrance', mode: 'insensitive' } },
        { collection: { contains: 'perfume', mode: 'insensitive' } }
      ]
    }
  });
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
