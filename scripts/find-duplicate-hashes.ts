import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const prisma = new PrismaClient();

function getFileHash(filePath: string): string | null {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (err) {
    return null;
  }
}

async function findDuplicateContent() {
  console.log("🕵️ Analyzing fragrance image contents to find hidden placeholders...");

  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { collection: { contains: "perfume", mode: "insensitive" } }
      ]
    }
  });

  const hashes: Record<string, string[]> = {}; // hash -> list of product names

  for (const p of products) {
    const photoPath = p.fotoPrincipal || "";
    const rel = photoPath.startsWith("/") ? photoPath.slice(1) : photoPath;
    const abs = path.resolve(process.cwd(), "public", rel);

    const hash = getFileHash(abs);
    if (hash) {
        if (!hashes[hash]) hashes[hash] = [];
        hashes[hash].push(p.nome);
    }
  }

  const duplicates = Object.entries(hashes).filter(([h, names]) => names.length > 5); // Common among many

  if (duplicates.length === 0) {
    console.log("No common content detected among fragrances.");
  } else {
    console.log("⚠️ Common Image Content Found (Likely Placeholders):");
    for (const [hash, names] of duplicates) {
        console.log(`Hash ${hash} shared by ${names.length} products:`);
        names.slice(0, 5).forEach(n => console.log(` - ${n}`));
        if (names.length > 5) console.log(` ... and ${names.length - 5} more.`);
    }
  }

  await prisma.$disconnect();
}

findDuplicateContent();
