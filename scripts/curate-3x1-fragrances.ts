import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FRAGRANCE_DATA = [
  {
    profile: ["Longevity: 8-10h", "Sillage: Strong", "Mood: Sophisticated & Bold"],
    notes: [
      { item: "Bergamot & Cardamom", percentage: "Top Notes" },
      { item: "Black Rose & Leather", percentage: "Heart Notes" },
      { item: "Oud & Ambergris", percentage: "Base Notes" }
    ],
    care: "Apply to pulse points: wrists, neck, and behind ears. Do not rub, as it breaks the fragrance molecules."
  },
  {
    profile: ["Longevity: 6-8h", "Sillage: Moderate", "Mood: Fresh & Energetic"],
    notes: [
      { item: "Sicilian Lemon & Mint", percentage: "Top Notes" },
      { item: "Sea Salt & Sage", percentage: "Heart Notes" },
      { item: "White Musk & Cedar", percentage: "Base Notes" }
    ],
    care: "Store in a cool, dark place away from direct sunlight to preserve the integrity of the essential oils."
  },
  {
    profile: ["Longevity: 10-12h", "Sillage: Enveloping", "Mood: Dark & Mysterious"],
    notes: [
      { item: "Saffron & Pink Pepper", percentage: "Top Notes" },
      { item: "Incense & Tobacco Leaf", percentage: "Heart Notes" },
      { item: "Vanilla Bean & Sandalwood", percentage: "Base Notes" }
    ],
    care: "For best results, apply immediately after a shower while your pores are open."
  }
];

const REVIEW_TEMPLATES = [
  { rating: 5, text: "The most sophisticated scent in my collection. The leather notes are incredibly realistic.", user: "James W." },
  { rating: 5, text: "Excellent longevity. I can still smell it on my coat days later. 10/10.", user: "Arthur P." },
  { rating: 4, text: "A truly premium experience. The packaging and the sillage are top-tier.", user: "Elena R." },
  { rating: 5, text: "Noir perfection. It's exactly the dark aesthetic I was looking for.", user: "Marcus K." },
  { rating: 5, text: "Complex and evolving. Every hour it reveals a new layer of depth.", user: "Sophia L." }
];

async function main() {
  console.log("🏺 Starting Noir Curatorship for 3x1 Fragrances...");

  // Get all perfumes in the 3x1 collection
  const products = await prisma.produto.findMany({
    where: {
      collection: { contains: "3x1", mode: "insensitive" }
    }
  });

  console.log(`📦 Found ${products.length} perfumes to curate.`);

  // Ensure a System User exists for the reviews
  const systemUser = await prisma.user.upsert({
    where: { email: "system@northmind.com" },
    update: {},
    create: {
      email: "system@northmind.com",
      name: "North Mind Curator",
    }
  });

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const data = FRAGRANCE_DATA[i % FRAGRANCE_DATA.length];

    // 1. Update Product Details (Notes and Profile)
    await prisma.produto.update({
      where: { id: p.id },
      data: {
        tipo: "PERFUME",
        especificacoes: data.profile,
        materiais: data.notes as any,
        instrucoesCuidado: data.care,
        mediaAvaliacoes: 4.8 + (Math.random() * 0.2),
        totalAvaliacoes: 12 + Math.floor(Math.random() * 50)
      } as any
    });

    // 2. Seed some reviews
    for (let j = 0; j < 3; j++) {
        const reviewData = REVIEW_TEMPLATES[(i + j) % REVIEW_TEMPLATES.length];
        
        const existing = await prisma.comentario.findMany({
            where: { produtoId: p.id, texto: reviewData.text }
        });

        if (existing.length === 0) {
            await prisma.comentario.create({
                data: {
                    rating: reviewData.rating,
                    texto: reviewData.text,
                    userName: reviewData.user,
                    produtoId: p.id,
                    userId: systemUser.id
                }
            });
        }
    }

    if (i % 10 === 0) console.log(`✨ Curated ${i} products...`);
  }

  console.log("✅ Noir Curatorship complete! All 3x1 perfumes now have profiles, notes, and reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
