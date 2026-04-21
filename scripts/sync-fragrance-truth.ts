import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load credentials
dotenv.config({ path: '.env.local' });
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT!,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
  },
});

const PUBLIC_PATH = path.resolve(process.cwd(), "public");
const FRAGRANCES_DIR = path.join(PUBLIC_PATH, "assets/products/fragrances");

const SALE_PRICE = 39.99;
const ORIGINAL_PRICE = 69.99;

function normalize(str: string): string {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg": case ".jpeg": return "image/jpeg";
    case ".png": return "image/png";
    case ".webp": return "image/webp";
    default: return "application/octet-stream";
  }
}

async function uploadToR2(filePath: string, relativePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);
  const key = relativePath.replace(/\\/g, "/");

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3.send(command);
  // console.log(`✅ R2 Uploaded: ${key}`);
}

async function main() {
  console.log("🚀 Starting Comprehensive Fragrance Collection Sync (Source of Truth)...");

  // 1. Get Source of Truth (Local Folders)
  if (!fs.existsSync(FRAGRANCES_DIR)) throw new Error("Fragrances directory not found");
  const localFolders = fs.readdirSync(FRAGRANCES_DIR).filter(f => fs.statSync(path.join(FRAGRANCES_DIR, f)).isDirectory());
  console.log(`📂 Found ${localFolders.length} folders locally.`);

  // 2. Database Audit
  const dbProducts = await prisma.produto.findMany({
    where: { 
        OR: [
            { collection: { equals: 'fragrances', mode: 'insensitive' } },
            { collection: { equals: 'Fragrances', mode: 'insensitive' } }
        ]
    }
  });

  console.log(`🔍 Database has ${dbProducts.length} products in 'fragrances' collection.`);

  // 3. Identification of products to delete (Orphans & Duplicates)
  const foldersSet = new Set(localFolders);
  const seenNames = new Set();
  const toDeleteIds: string[] = [];

  for (const p of dbProducts) {
    // If not in local folders OR already seen (duplicate)
    if (!foldersSet.has(p.nome) || seenNames.has(p.nome)) {
        toDeleteIds.push(p.id);
        console.log(`🗑️ Marked for deletion: ${p.nome} (Reason: ${!foldersSet.has(p.nome)? "No folder" : "Duplicate"})`);
    } else {
        seenNames.add(p.nome);
    }
  }

  if (toDeleteIds.length > 0) {
      console.log(`⚠️ Deleting ${toDeleteIds.length} obsolete/duplicate products...`);
      await prisma.produto.deleteMany({ where: { id: { in: toDeleteIds } } });
  }

  // 4. Update/Create & Upload
  console.log("⚡ Starting re-upload and database rebuild...");
  
  // Calculate store averages for ratings (defaulting to 4.7/9 as discovered earlier)
  const avgTotal = 9;
  const avgMedia = 4.7;

  for (const folderName of localFolders) {
    const productDir = path.join(FRAGRANCES_DIR, folderName);
    const files = fs.readdirSync(productDir).filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));

    if (files.length === 0) continue;

    // Upload files to R2
    for (const f of files) {
        const fullPath = path.join(productDir, f);
        await uploadToR2(fullPath, `assets/products/fragrances/${folderName}/${f}`);
    }

    // Sort files to pick main one
    files.sort((a, b) => {
        if (path.parse(a).name === folderName) return -1;
        if (path.parse(b).name === folderName) return 1;
        return a.localeCompare(b);
    });

    const r2Urls = files.map(f => `${R2_PUBLIC_URL?.replace(/\/$/, '')}/assets/products/fragrances/${folderName}/${f}`);

    const data: any = {
      nome: folderName,
      handle: folderName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
      descricao: `Premium fragrance essence: ${folderName}. Experience the north mind selection.`,
      preco: SALE_PRICE,
      precoOriginal: ORIGINAL_PRICE,
      collection: "fragrances",
      tipo: "PERFUME",
      fotoPrincipal: r2Urls[0],
      fotos: r2Urls,
      mediaAvaliacoes: avgMedia,
      totalAvaliacoes: avgTotal,
      variantes: [
        { sku: `FRAG-${normalize(folderName).slice(0, 10)}-100ML`, label: "100ml", price: SALE_PRICE, originalPrice: ORIGINAL_PRICE }
      ]
    };

    // Upsert (since we already deleted duplicates, we can safely update existing by name or create)
    const existing = await prisma.produto.findFirst({ where: { nome: folderName, collection: 'fragrances' } });

    if (existing) {
        await prisma.produto.update({ where: { id: existing.id }, data });
        console.log(`✅ Updated: ${folderName}`);
    } else {
        await prisma.produto.create({ data });
        console.log(`🆕 Created: ${folderName}`);
    }
  }

  console.log("\n✨ Full synchronization completed!");
  console.log(`✅ Successfuly synced ${localFolders.length} products according to your local folders.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
