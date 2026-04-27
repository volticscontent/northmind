
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: 'fragrance', mode: 'insensitive' } },
        { tipo: 'PERFUME' }
      ]
    },
    select: {
      id: true,
      nome: true,
      preco: true,
      precoOriginal: true,
      collection: true
    }
  });

  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
