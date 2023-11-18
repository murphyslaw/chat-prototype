import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET() {
  const rooms = await db.room.findMany();

  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const { name }: { name: string } = await request.json();

  if (!name) throw new Error("Room name missing");

  const room = await db.room.create({
    data: {
      name: name,
    },
  });

  return NextResponse.json(room, {
    status: 201,
    headers: {
      Location: `${request.url}/${room.id}`,
    },
  });
}
