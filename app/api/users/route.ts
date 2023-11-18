import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET() {
  const users = await db.user.findMany();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name }: { name: string } = await request.json();

  if (!name) throw new Error("User name missing");

  const user = await db.user.create({
    data: {
      name: name,
    },
  });

  return NextResponse.json(user, {
    status: 201,
    headers: {
      Location: `${request.url}/${user.id}`,
    },
  });
}
