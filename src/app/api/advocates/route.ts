import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");

  const data = await db.select().from(advocates);

  return Response.json({ data });
}
