import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../northmind_backend-main/.env' });
const prisma = new PrismaClient();

const FRAGRANCES_DIR = path.resolve(process.cwd(), 'public/assets/products/fragrances');

async function audit() {
  const localFolders = fs.readdirSync(FRAGRANCES_DIR).filter(f => 
    fs.statSync(path.join(FRAGRANCES_DIR, f)).isDirectory()
  );

  const dbProducts = await prisma.produto.findMany({
    where: { collection: 'fragrances' },
    select: { id: true, nome: true, handle: true, fotoPrincipal: true }
  });

  console.log("--- LOCAL FOLDERS ---");
  console.log(localFolders);

  console.log("\n--- DATABASE PRODUCTS ---");
  console.log(dbProducts.map(p => ({ id: p.id, nome: p.nome, handle: p.handle })));

  const foldersSet = new Set(localFolders);
  const productsToDelete = dbProducts.filter(p => !foldersSet.has(p.nome));
  
  const seenNames = new Set();
  const duplicates = dbProducts.filter(p => {
    if (seenNames.has(p.nome)) return true;
    seenNames.add(p.nome);
    return false;
  });

  console.log("\n--- TO DELETE (No Folder) ---");
  console.log(productsToDelete.map(p => p.nome));

  console.log("\n--- DUPLICATES ---");
  console.log(duplicates.map(p => p.nome));
}

audit().finally(() => prisma.$disconnect());
