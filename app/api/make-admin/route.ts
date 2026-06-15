import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const defaultEmail = "admin@northmind.uk";
    const password = "NorthMindAdmin2024!";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
      where: { email: defaultEmail },
      update: { hashedPassword },
      create: {
        email: defaultEmail,
        name: "North Mind Admin",
        hashedPassword,
      }
    });

    return NextResponse.json({ success: true, admin: admin.email, message: "Admin account ready" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
