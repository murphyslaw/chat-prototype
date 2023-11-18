import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  const room = await db.room.findFirstOrThrow({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json(room);
}
