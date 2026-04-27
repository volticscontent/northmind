import { PrismaClient } from '@prisma/client';
import "dotenv/config";

const prisma = new PrismaClient();

async function check() {
  const admin = await prisma.admin.findUnique({ where: { email: 'volticsbr@gmail.com' } });
  console.log('Admin:', JSON.stringify(admin, null, 2));
  process.exit(0);
}

check();
