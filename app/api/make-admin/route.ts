// Esta rota foi migrada para o Backend API
// Use: POST ${API_URL}/api/admin/make-admin
import { NextResponse } from "next/server";

export async function GET() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  try {
    const res = await fetch(`${API_URL}/api/admin/make-admin`, { method: "POST" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
