import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT || !R2_BUCKET_NAME) {
  console.error("❌ Missing R2 credentials in .env.local file");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const PUBLIC_PATH = path.resolve(process.cwd(), "public");
const FRAGRANCES_DIR = path.join(PUBLIC_PATH, "assets/products/fragrances");

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function uploadFile(filePath: string, relativePath: string) {
  const fileContent = fs.readFileSync(filePath);
  const contentType = getContentType(filePath);
  
  // The key in R2 should match the relative path from public folder
  // e.g., assets/products/fragrances/brand/product.jpg
  const key = relativePath.replace(/\\/g, "/");

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  try {
    await s3.send(command);
    console.log(`✅ Uploaded: ${key}`);
  } catch (error) {
    console.error(`❌ Failed to upload ${key}:`, error);
  }
}

async function walkAndUpload(dir: string, baseDir: string) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await walkAndUpload(fullPath, baseDir);
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      await uploadFile(fullPath, relativePath);
    }
  }
}

async function main() {
  console.log("🚀 Starting upload of fragrance images to R2...");
  console.log(`📁 Source: ${FRAGRANCES_DIR}`);
  console.log(`🪣 Bucket: ${R2_BUCKET_NAME}`);

  if (!fs.existsSync(FRAGRANCES_DIR)) {
    console.error(`❌ Source directory does not exist: ${FRAGRANCES_DIR}`);
    process.exit(1);
  }

  // baseDir is PUBLIC_PATH to get "assets/products/fragrances/..."
  await walkAndUpload(FRAGRANCES_DIR, PUBLIC_PATH);

  console.log("✨ All images uploaded successfully!");
}

main().catch(console.error);
