import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '../northmind_backend-main/.env') });

const prisma = new PrismaClient();

async function main() {
  const sourceHandle = '3-piece-premium-fragrance-collection-set-43';
  const targetHandle = 'yves-saint-laurent-mon-paris-eau-de-parfum';

  console.log(`🔍 Finding products...`);
  const source = await prisma.produto.findUnique({
    where: { handle: sourceHandle },
    include: { comentarios: true }
  });

  const target = await prisma.produto.findUnique({
    where: { handle: targetHandle }
  });

  if (!source || !target) {
    console.error("❌ Source or Target product not found!");
    console.log("Source found:", !!source);
    console.log("Target found:", !!target);
    return;
  }

  console.log(`🚀 Migrating data from [${source.nome}] to [${target.nome}]...`);

  // 1. Update target product fields
  await prisma.produto.update({
    where: { id: target.id },
    data: {
      especificacoes: source.especificacoes,
      materiais: source.materiais as any,
      instrucoesCuidado: source.instrucoesCuidado,
      totalAvaliacoes: source.totalAvaliacoes,
      mediaAvaliacoes: source.mediaAvaliacoes
    }
  });
  console.log("✅ Updated technical fields (Profile, Notes, Care, Ratings).");

  // 2. Clone comments
  console.log(`💬 Clowning ${source.comentarios.length} reviews...`);
  
  // Clear existing comments on target if any (optional, but keep it clean)
  await prisma.comentario.deleteMany({
    where: { produtoId: target.id }
  });

  for (const comment of source.comentarios) {
    await prisma.comentario.create({
      data: {
        rating: comment.rating,
        texto: comment.texto,
        fotos: comment.fotos,
        videoUrl: comment.videoUrl,
        userId: comment.userId,
        userName: comment.userName,
        produtoId: target.id,
        createdAt: comment.createdAt // Preserve original date
      }
    });
  }
  console.log("✅ Successfully cloned reviews.");

  console.log("\n✨ Data migration finished!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
