import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  try {
    const email = "volticsbr@gmail.com";
    
    // Tenta atualizar se existir, ou cria um novo usuário admin
    const user = await prisma.user.upsert({
      where: { email },
      update: { role: "ADMIN" },
      create: {
        email,
        name: "Voltics",
        role: "ADMIN"
      }
    });

    console.log(`Sucesso: Usuário ${user.email} atualizado para a role ${user.role}.`);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();
