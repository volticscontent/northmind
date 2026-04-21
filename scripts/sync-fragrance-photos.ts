import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load R2 info from frontend
dotenv.config({ path: '.env.local' });
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

// Load DB info from backend
dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

const PUBLIC_PATH = path.resolve(process.cwd(), "public");
const FRAGRANCES_DIR = path.join(PUBLIC_PATH, "assets/products/fragrances");

function normalize(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/[^a-z0-9]/g, "") // remove non-alphanumeric
        .trim();
}

async function main() {
  console.log("🚀 Starting improved synchronization of fragrance photos...");
  
  if (!R2_PUBLIC_URL) {
    console.error("❌ R2_PUBLIC_URL not found in .env.local");
    process.exit(1);
  }

  if (!fs.existsSync(FRAGRANCES_DIR)) {
    console.error(`❌ Fragrances directory not found: ${FRAGRANCES_DIR}`);
    process.exit(1);
  }

  const folders = fs.readdirSync(FRAGRANCES_DIR).filter(f => {
    return fs.statSync(path.join(FRAGRANCES_DIR, f)).isDirectory();
  });

  console.log(`🔍 Found ${folders.length} local folders. Fetching database products...`);

  const allProducts = await prisma.produto.findMany();
  const normalizedProductMap = new Map();

  for (const p of allProducts) {
    normalizedProductMap.set(normalize(p.nome), p);
  }

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const folderName of folders) {
    const productDir = path.join(FRAGRANCES_DIR, folderName);
    const files = fs.readdirSync(productDir).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });

    if (files.length === 0) continue;

    // Try finding by exact name first, then by normalized name
    let product = allProducts.find(p => p.nome === folderName);
    if (!product) {
        product = normalizedProductMap.get(normalize(folderName));
    }

    if (!product) {
      console.warn(`❓ Not found: "${folderName}"`);
      notFoundCount++;
      continue;
    }

    // Construct R2 URLs
    files.sort((a, b) => {
        const nameA = path.parse(a).name;
        const nameB = path.parse(b).name;
        if (nameA === folderName || nameA === product?.nome) return -1;
        if (nameB === folderName || nameB === product?.nome) return 1;
        return a.localeCompare(b);
    });

    const r2Urls = files.map(f => {
        const relativePath = `assets/products/fragrances/${folderName}/${f}`;
        return `${R2_PUBLIC_URL.replace(/\/$/, '')}/${relativePath}`;
    });

    // Update product
    await prisma.produto.update({
      where: { id: product.id },
      data: {
        fotoPrincipal: r2Urls[0],
        fotos: r2Urls,
        collection: "fragrances",
        tipo: "PERFUME"
      }
    });

    console.log(`✅ Updated: ${product.nome}`);
    updatedCount++;
  }

  console.log("\n✨ Sync finished!");
  console.log(`📈 Products updated: ${updatedCount}`);
  console.log(`📉 Products not found: ${notFoundCount}`);
  
  if (notFoundCount > 0) {
      console.log("\nSome folders didn't match any product in the database. Please check naming consistency.");
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
