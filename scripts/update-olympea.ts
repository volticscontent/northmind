import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load credentials from backend's .env
const BACKEND_ENV = path.resolve("D:/lucas/Desktop/northmind_backend-main/.env");
dotenv.config({ path: BACKEND_ENV });

const {
    DATABASE_URL,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_ENDPOINT,
    R2_BUCKET_NAME,
    R2_PUBLIC_URL
} = process.env;

const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } }
});

const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT!,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID!,
        secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
});

const PRODUCT_NAME = "Paco Rabanne Olympéa";
// Specific folder in northmind-main which has the most recent file
const PRODUCT_DIR = `D:/lucas/Desktop/northmind-main/public/assets/products/fragrances/Paco Rabanne Olympéa`;

async function uploadToR2(filePath: string, relativePath: string) {
    const fileContent = fs.readFileSync(filePath);
    const key = relativePath.replace(/\\/g, "/");
    const command = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: "image/jpeg",
    });
    await s3.send(command);
    console.log(`✅ Uploaded to R2: ${key}`);
}

async function main() {
    console.log(`🚀 Updating images for ${PRODUCT_NAME} from ${PRODUCT_DIR}...`);

    if (!fs.existsSync(PRODUCT_DIR)) {
        throw new Error(`Directory not found: ${PRODUCT_DIR}`);
    }

    const files = fs.readdirSync(PRODUCT_DIR).filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));

    if (files.length === 0) {
        throw new Error("No images found in the directory.");
    }

    // Identify the most recent file
    const fileStats = files.map(f => ({
        name: f,
        mtime: fs.statSync(path.join(PRODUCT_DIR, f)).mtime.getTime()
    }));
    fileStats.sort((a, b) => b.mtime - a.mtime);
    
    const newestFile = fileStats[0].name;
    console.log(`📸 Newest file identified: ${newestFile}`);

    // Upload newest to R2
    const relativePath = `assets/products/fragrances/${PRODUCT_NAME}/${newestFile}`;
    await uploadToR2(path.join(PRODUCT_DIR, newestFile), relativePath);

    const r2Url = `${R2_PUBLIC_URL?.replace(/\/$/, '')}/${relativePath.replace(/\\/g, "/")}`;

    // Update DB to use ONLY this new image
    await prisma.produto.updateMany({
        where: { nome: PRODUCT_NAME, collection: { in: ['fragrances', 'Fragrances'] } },
        data: {
            fotoPrincipal: r2Url,
            fotos: [r2Url]
        }
    });

    console.log(`✨ Successfully updated ${PRODUCT_NAME}. Now has only the NEW image.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
