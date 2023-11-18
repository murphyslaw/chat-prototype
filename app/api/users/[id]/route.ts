import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET({ params }: { params: { id: string } }) {
  const user = await db.user.findFirstOrThrow({
    where: { id: parseInt(params.id) },
  });

  return NextResponse.json(user);
}
