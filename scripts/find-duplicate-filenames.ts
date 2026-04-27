import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

async function findDuplicateBasenames() {
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
        const basename = path.basename(p.fotoPrincipal);
        counts[basename] = (counts[basename] || 0) + 1;
    }
  }

  const duplicates = Object.entries(counts).filter(([name, count]) => count > 1);

  if (duplicates.length === 0) {
    console.log("No duplicate filenames found among fragrances.");
  } else {
    console.log("⚠️ Found duplicate filenames:");
    duplicates.sort((a,b) => b[1] - a[1]).forEach(([name, count]) => {
        console.log(`${count} products share filename: ${name}`);
    });
  }

  await prisma.$disconnect();
}

findDuplicateBasenames();
