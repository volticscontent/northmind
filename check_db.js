const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.produto.findMany({ take: 5 });
  console.log('---PRODUCTS_JSON_START---');
  console.log(JSON.stringify(p, null, 2));
  console.log('---PRODUCTS_JSON_END---');
}
main().catch(console.error).finally(() => prisma.$disconnect());
