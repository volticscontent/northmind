import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load credentials from backend's .env as it has everything
const BACKEND_ENV = path.resolve("D:/lucas/Desktop/northmind_backend-main/.env");
if (!fs.existsSync(BACKEND_ENV)) {
    console.error(`❌ Backend .env not found at ${BACKEND_ENV}`);
    process.exit(1);
}
dotenv.config({ path: BACKEND_ENV });

const {
    DATABASE_URL,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_ENDPOINT,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL
} = process.env;

if (!DATABASE_URL || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    console.error("❌ Missing required environment variables in backend .env");
    process.exit(1);
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL
        }
    }
});

const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT!,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
});

// SOURCE of truth folder
const SOURCE_DIR = "D:/lucas/Desktop/perfumUkStripe/public/assets/products/fragrances";

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

    await s3.send(command).catch(err => {
        console.error(`❌ Error uploading ${key}:`, err.message);
    });
}

async function main() {
    console.log("🚀 Starting Fragrance Collection Sync focused on UK update...");
    console.log(`📂 Source: ${SOURCE_DIR}`);

    if (!fs.existsSync(SOURCE_DIR)) {
        throw new Error(`Source directory not found: ${SOURCE_DIR}`);
    }

    // 1. Get Source of Truth (Local Folders)
    const localFolders = fs.readdirSync(SOURCE_DIR).filter(f => fs.statSync(path.join(SOURCE_DIR, f)).isDirectory());
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

    // 3. Identification of products to delete (Orphans)
    // The user wants ONLY the new products added/present in the folder
    const foldersSet = new Set(localFolders);
    const toDeleteIds: string[] = [];

    for (const p of dbProducts) {
        if (!foldersSet.has(p.nome)) {
            toDeleteIds.push(p.id);
            console.log(`🗑️ Marked for deletion (Not in local folders): ${p.nome}`);
        }
    }

    if (toDeleteIds.length > 0) {
        console.log(`⚠️ Deleting ${toDeleteIds.length} obsolete products...`);
        await prisma.produto.deleteMany({ where: { id: { in: toDeleteIds } } });
    } else {
        console.log("✅ No obsolete products to delete.");
    }

    // 4. Update/Create & Upload
    console.log("⚡ Starting sync and R2 uploads...");
    
    const avgTotal = 9;
    const avgMedia = 4.7;

    for (const folderName of localFolders) {
        const productDir = path.join(SOURCE_DIR, folderName);
        const files = fs.readdirSync(productDir).filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));

        if (files.length === 0) {
            console.log(`⏭️ Skipping ${folderName} (No images found)`);
            continue;
        }

        // Upload files to R2
        for (const f of files) {
            const fullPath = path.join(productDir, f);
            await uploadToR2(fullPath, `assets/products/fragrances/${folderName}/${f}`);
        }

        // Sort files to pick main one (prefer folder name match)
        files.sort((a, b) => {
            if (path.parse(a).name === folderName) return -1;
            if (path.parse(b).name === folderName) return 1;
            return a.localeCompare(b);
        });

        const r2Urls = files.map(f => `${R2_PUBLIC_URL?.replace(/\/$/, '')}/assets/products/fragrances/${folderName}/${f}`);

        const handle = folderName.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

        const existing = await prisma.produto.findFirst({ 
            where: { nome: folderName, collection: { in: ['fragrances', 'Fragrances'] } } 
        });

        const data: any = {
            nome: folderName,
            handle: handle,
            descricao: existing?.descricao || `Premium fragrance essence: ${folderName}. Experience the north mind selection.`,
            preco: existing?.preco || SALE_PRICE,
            precoOriginal: existing?.precoOriginal || ORIGINAL_PRICE,
            collection: "fragrances",
            tipo: "PERFUME",
            fotoPrincipal: r2Urls[0],
            fotos: r2Urls,
            mediaAvaliacoes: existing?.mediaAvaliacoes || avgMedia,
            totalAvaliacoes: existing?.totalAvaliacoes || avgTotal,
            variantes: existing?.variantes || [
                { sku: `FRAG-${normalize(folderName).slice(0, 10)}-100ML`, label: "100ml", price: SALE_PRICE, originalPrice: ORIGINAL_PRICE }
            ]
        };

        if (existing) {
            await prisma.produto.update({ where: { id: existing.id }, data });
            console.log(`✅ Updated: ${folderName}`);
        } else {
            await prisma.produto.create({ data });
            console.log(`🆕 Created: ${folderName}`);
        }
    }

    console.log("\n✨ Full synchronization completed!");
    console.log(`✅ Successfully synced ${localFolders.length} products.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
