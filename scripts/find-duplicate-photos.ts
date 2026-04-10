import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findDuplicatePhotos() {
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    },
    select: {
      id: true,
      nome: true,
      fotoPrincipal: true
    }
  });

  const counts: Record<string, number> = {};
  for (const p of products) {
    if (p.fotoPrincipal) {
        counts[p.fotoPrincipal] = (counts[p.fotoPrincipal] || 0) + 1;
    }
  }

  const duplicates = Object.entries(counts).filter(([path, count]) => count > 1);

  if (duplicates.length === 0) {
    console.log("No duplicate paths found among fragrances.");
  } else {
    console.log("⚠️ Found duplicate photo paths:");
    duplicates.sort((a,b) => b[1] - a[1]).forEach(([path, count]) => {
        console.log(`${count} products share: ${path}`);
    });
  }

  await prisma.$disconnect();
}

findDuplicatePhotos();
