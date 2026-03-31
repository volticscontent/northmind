import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import * as fs from "fs";
import * as path from "path";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed Admin
  console.log("Seeding admin...");
  const adminEmail = "volticsbr@gmail.com";
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      hashedPassword: hashedPassword,
    },
    create: {
      email: adminEmail,
      name: "Voltics Admin",
      hashedPassword: hashedPassword,
    },
  });
  console.log(`Admin ${adminEmail} seeded successfully.`);

  // 2. Seed Products
  const productsFilePath = path.join(__dirname, "..", "data", "products.json");
  const productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

  console.log("Seeding products...");

  for (const product of productsData.products) {
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
  }

  console.log("Products seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
