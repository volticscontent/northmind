import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "northmind";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// Extensões permitidas
const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|webm|avif/;

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string || "products").replace(/[^a-z0-9-_]/gi, "");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const extMatch = file.name.match(/\.[0-9a-z]+$/i);
      const ext = extMatch ? extMatch[0].toLowerCase() : '';
      
      if (!allowedTypes.test(ext) && !allowedTypes.test(file.type.split("/")[1])) {
        return NextResponse.json({ error: `Formato de arquivo não suportado: ${file.name}` }, { status: 400 });
      }

      const key = `${folder}/${crypto.randomUUID()}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      await s3.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }));

      urls.push(`${PUBLIC_URL}/${key}`);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return NextResponse.json({ error: "Falha no upload." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key } = await req.json();
    if (!key) return NextResponse.json({ error: "Key é obrigatória." }, { status: 400 });

    const objectKey = key.startsWith("http") ? new URL(key).pathname.slice(1) : key;

    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: objectKey,
    }));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE_OBJECT_ERROR", error);
    return NextResponse.json({ error: "Falha ao deletar." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if ((session?.user as any)?.type !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const prefix = searchParams.get("folder") || "products/";

    const result = await s3.send(new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: prefix,
      MaxKeys: 100,
    }));

    const objects = (result.Contents || []).map(obj => ({
      key: obj.Key,
      url: `${PUBLIC_URL}/${obj.Key}`,
      size: obj.Size,
      lastModified: obj.LastModified,
    }));

    return NextResponse.json({ objects });
  } catch (error) {
    console.error("LIST_OBJECTS_ERROR", error);
    return NextResponse.json({ error: "Falha ao listar." }, { status: 500 });
  }
}
