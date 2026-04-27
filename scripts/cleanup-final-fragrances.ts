import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteBrokenFragrances() {
  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    }
  });

  console.log(`Checking ${products.length} fragrances...`);
  
  let deletedCount = 0;
  for (const p of products) {
    const photoPath = p.fotoPrincipal || "";
    
    // Condition 1: External URL (Shopify) - user says "esta foto" might be the placeholder
    const isExternal = photoPath.startsWith("http");
    
    // Condition 2: Missing local file
    let isMissing = false;
    if (!isExternal && photoPath.startsWith("/")) {
        const rel = photoPath.slice(1);
        const abs = path.resolve(process.cwd(), "public", rel);
        if (!fs.existsSync(abs)) {
            isMissing = true;
        }
    } else if (!isExternal && photoPath !== "") {
        const abs = path.resolve(process.cwd(), "public", photoPath);
        if (!fs.existsSync(abs)) {
            isMissing = true;
        }
    }

    if (isExternal || isMissing || photoPath === "") {
        console.log(`🗑️ DELETING: ${p.nome}. Reason: ${isExternal ? "External URL" : isMissing ? "File Missing" : "Empty"}`);
        await prisma.produto.delete({ where: { id: p.id } });
        deletedCount++;
    }
  }
  
  console.log(`--- Cleaned ${deletedCount} defective fragrances ---`);
  await prisma.$disconnect();
}

deleteBrokenFragrances();
