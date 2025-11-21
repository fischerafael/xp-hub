import { NextResponse } from "next/server";
import {
  getXpByOwnerIdWithFilters,
  addXp,
  editXp,
  removeXp,
  getItemById,
} from "@/src/server/services/xp-service";

export async function GET(request: Request) {
  const ownerId = request.headers.get("owner-id") || "";
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const idParam = searchParams.get("id");

  if (idParam) {
    return NextResponse.json(await getItemById(idParam));
  }

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");
  const categoryIdsParam = searchParams.get("categoryIds");

  const options: {
    startDate?: Date;
    endDate?: Date;
    categoryIds?: string[];
  } = {};

  if (startDateParam) {
    options.startDate = new Date(startDateParam);
  }

  if (endDateParam) {
    options.endDate = new Date(endDateParam);
  }

  if (categoryIdsParam) {
    options.categoryIds = categoryIdsParam.split(",").filter(Boolean);
  }

  return NextResponse.json(await getXpByOwnerIdWithFilters(ownerId, options));
}

export async function POST(request: Request) {
  const ownerId = request.headers.get("owner-id") || "";
  const body = await request.json();

  return NextResponse.json(await addXp({ ...body, ownerId }), { status: 201 });
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";
  const body = await request.json();

  return NextResponse.json(await editXp(id, body));
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id") || "";

  await removeXp(id);
  return NextResponse.json({});
}
