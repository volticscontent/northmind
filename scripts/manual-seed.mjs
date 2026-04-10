import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    // 1. Seed Admin
    console.log("Seeding admin...");
    const adminEmail = "volticsbr@gmail.com";
    const hashedPassword = await bcrypt.hash("admin123", 12);

    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: { hashedPassword },
      create: {
        email: adminEmail,
        name: "Voltics Admin",
        hashedPassword,
      },
    });
    console.log(`Admin ${adminEmail} seeded successfully.`);

    // 2. Seed Collections
    const productsFilePath = path.join(__dirname, "..", "data", "products.json");
    const productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    
    console.log("Seeding collections...");
    const uniqueCollections = [...new Set(productsData.products.map(p => p.collection))];

    for (const collectionName of uniqueCollections) {
      const handle = collectionName.toLowerCase().replace(/\s+/g, '-');
      await prisma.collection.upsert({
        where: { handle },
        update: { name: collectionName },
        create: {
          name: collectionName,
          handle,
          description: `All products in ${collectionName}`
        }
      });
    }
    console.log(`${uniqueCollections.length} collections seeded successfully.`);

    // 3. Seed Products
    console.log(`Seeding contents from: ${productsFilePath}`);
    console.log(`Found ${productsData.products.length} products in JSON.`);

    for (const product of productsData.products) {
      console.log(`Upserting product: ${product.title} (${product.handle})`);
      try {
        await prisma.produto.upsert({
          where: { handle: product.handle },
          update: {
            nome: product.title,
            descricao: product.description,
            preco: product.price,
            precoOriginal: product.originalPrice,
            collection: product.collection,
            fotos: product.images,
          },
          create: {
            id: product.id,
            nome: product.title,
            handle: product.handle,
            descricao: product.description,
            preco: product.price,
            precoOriginal: product.originalPrice,
            collection: product.collection,
            fotos: product.images,
          },
        });
        console.log(`- Success: ${product.handle}`);
      } catch (err) {
        console.error(`- Failed to upsert ${product.handle}:`, err.message);
      }
    }

    console.log("Products seeding process finished.");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
