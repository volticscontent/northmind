import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Detecting unique collection names from products...");
  
  const products = await prisma.produto.findMany({
    select: { collection: true }
  });

  const uniqueNames = Array.from(new Set(products.map(p => p.collection).filter(Boolean)));

  console.log(`Found ${uniqueNames.length} unique collections: ${uniqueNames.join(", ")}`);

  for (const name of uniqueNames) {
    const handle = name.toLowerCase().replace(/\s+/g, '-');
    
    await prisma.collection.upsert({
      where: { handle },
      update: { name },
      create: {
        name,
        handle,
        image: `/assets/collections/${handle}.png`, // Placeholder pattern
        description: `Premium collection of ${name}`
      }
    });
    console.log(`Collection '${name}' created/synced.`);
  }

  console.log("Collections restoration complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
