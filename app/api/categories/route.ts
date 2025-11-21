import { NextResponse } from "next/server";
import {
  getCategoriesByOwnerId,
  getCategoryById,
  addCategory,
  editCategory,
  removeCategory,
} from "@/src/server/services/category-service";

export async function GET(request: Request) {
  const ownerId = request.headers.get("owner-id") || "";
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const idParam = searchParams.get("id");

  if (idParam) {
    return NextResponse.json(await getCategoryById(idParam));
  }

  return NextResponse.json(await getCategoriesByOwnerId(ownerId));
}

export async function POST(request: Request) {
  const ownerId = request.headers.get("owner-id") || "";
  const body = await request.json();

  return NextResponse.json(await addCategory({ ...body, ownerId }), {
    status: 201,
  });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const body = await request.json();

  return NextResponse.json(await editCategory(id, body));
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";

  await removeCategory(id);
  return NextResponse.json({});
}
