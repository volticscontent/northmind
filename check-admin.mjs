import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  const admin = await prisma.admin.findUnique({ where: { email: 'volticsbr@gmail.com' } });
  console.log('Admin:', JSON.stringify(admin, null, 2));
  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
