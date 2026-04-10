import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function findDefective() {
  const products = await prisma.produto.findMany(); // ALL PRODUCTS

  console.log(`Checking ${products.length} products...`);
  
  for (const p of products) {
    const photoPath = p.fotoPrincipal || "";
    if (photoPath === "") {
        console.log(`[EMPTY] ${p.nome}`);
        continue;
    }

    const rel = photoPath.startsWith("/") ? photoPath.slice(1) : photoPath;
    const abs = path.resolve(process.cwd(), "public", rel);

    if (!fs.existsSync(abs)) {
        console.log(`[MISSING] ${p.nome} - Path: ${photoPath}`);
    }
  }
  await prisma.$disconnect();
}

findDefective();
