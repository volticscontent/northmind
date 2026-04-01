import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function extremeCleanup() {
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
    let photoPath = (p.fotoPrincipal || "").trim(); // TRIMMED
    
    // Condition 1: External URL (Shopify)
    const isExternal = photoPath.startsWith("http");
    
    // Condition 2: Missing local file
    let isMissing = false;
    if (!isExternal && photoPath !== "") {
        const rel = photoPath.startsWith("/") ? photoPath.slice(1) : photoPath;
        const abs = path.resolve(process.cwd(), "public", rel);
        if (!fs.existsSync(abs)) {
            isMissing = true;
        }
    }

    if (isExternal || isMissing || photoPath === "") {
        console.log(`🗑️ DELETE: ${p.nome}. Reason: ${isExternal ? "External" : isMissing ? "Missing Disk" : "Empty"}`);
        await prisma.produto.delete({ where: { id: p.id } });
        deletedCount++;
    }
  }
  
  console.log(`--- Cleaned ${deletedCount} defective fragrances ---`);
  await prisma.$disconnect();
}

extremeCleanup();
