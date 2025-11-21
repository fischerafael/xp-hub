import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/src/server/services/user-service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";

  return NextResponse.json(await getUserByEmail(email));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name } = body;

  return NextResponse.json(await createUser(email, name), { status: 201 });
}
