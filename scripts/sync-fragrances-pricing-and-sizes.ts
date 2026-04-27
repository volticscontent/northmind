import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  FRAGRANCE_OVERRIDE_ENTRIES,
  getFragranceSizes,
  normalizeFragranceTitle,
} from "../lib/fragrance-overrides";

const prisma = new PrismaClient();

const OVERRIDES = new Map(
  FRAGRANCE_OVERRIDE_ENTRIES.map(([title, override]) => [
    normalizeFragranceTitle(title),
    { title, override },
  ]),
);

async function main() {
  console.log("Syncing fragrance prices and sizes from frontend overrides...");

  const products = await prisma.produto.findMany({
    where: {
      OR: [
        { collection: { contains: "fragrance", mode: "insensitive" } },
        { tipo: "PERFUME" },
      ],
    },
    select: {
      id: true,
      nome: true,
      handle: true,
      collection: true,
    },
  });

  let updated = 0;
  let unmatched = 0;

  for (const product of products) {
    const match = OVERRIDES.get(normalizeFragranceTitle(product.nome));

    if (!match) {
      unmatched += 1;
      console.warn(`No override found for: ${product.nome} (${product.handle})`);
      continue;
    }

    await prisma.produto.update({
      where: { id: product.id },
      data: {
        preco: match.override.price,
        precoOriginal: match.override.originalPrice,
        opcoesTamanho: getFragranceSizes(match.override),
      },
    });

    updated += 1;
  }

  console.log(`Updated ${updated} fragrance products.`);

  if (unmatched > 0) {
    console.warn(`Skipped ${unmatched} products without a matching override.`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
