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
        publicado: true,
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
        publicado: true,
      },
    });
  }

  console.log("Products seeded successfully.");

  // 3. Sync Collections (Restore All Catalog Sections)
  console.log("🚀 Syncing all core collections (Noir Aesthetic)...");

  const coreCollections = [
    {
      handle: "jackets",
      name: "Jackets",
      image: "/collections/jackets.png",
      desc: "Heritage leather and artisan-crafted outerwear. Noir Collection.",
    },
    {
      handle: "silent-warmth",
      name: "Silent Warmth",
      image: "/collections/silent-warmth.png",
      desc: "Premium heavyweight knitwear and winter essences. Noir Collection.",
    },
    {
      handle: "fragrances",
      name: "Fragrances",
      image: "/collections/fragrances.png",
      desc: "Signature scents and modern chic perfumery. Noir Collection.",
    },
    {
      handle: "t-shirts",
      name: "T-Shirts",
      image: "/collections/t-shirts.png",
      desc: "Minimalist luxury essentials in premium cotton. Noir Collection.",
    },
    {
      handle: "special-promo",
      name: "3/1 fragrances",
      image: "/collections/special-promo.png",
      desc: "Exclusive access to seasonal drops and limited pieces.",
    },
    {
      handle: "kits",
      name: "Kits",
      image: "/collections/kits.png",
      desc: "Curated gift sets for the complete luxury experience.",
    },
  ];

  for (const item of coreCollections) {
    await prisma.collection.upsert({
      where: { handle: item.handle },
      update: {
        name: item.name,
        description: item.desc,
        image: item.image,
      },
      create: {
        handle: item.handle,
        name: item.name,
        description: item.desc,
        image: item.image,
      },
    });
  }

  console.log("✨ All 6 core collections synced successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
