import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const rooms = [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  return NextResponse.json(rooms);
}
