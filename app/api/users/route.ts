import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET(request: Request) {
  const users = await db.user.findMany();

  return NextResponse.json(users);
}
