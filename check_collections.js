const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const collections = await prisma.collection.findMany();
  console.log('---COLLECTIONS_JSON_START---');
  console.log(JSON.stringify(collections, null, 2));
  console.log('---COLLECTIONS_JSON_END---');
}
main().catch(console.error).finally(() => prisma.$disconnect());
