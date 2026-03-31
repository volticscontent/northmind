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
  const admins = await prisma.admin.findMany({ where: { email: 'volticsbr@gmail.com' } });
  const users = await prisma.user.findMany({ where: { email: 'volticsbr@gmail.com' } });
  console.log('Admins:', JSON.stringify(admins, null, 2));
  console.log('Users:', JSON.stringify(users, null, 2));
  process.exit(0);
}

check().catch(e => {
  console.error(e);
  process.exit(1);
});
