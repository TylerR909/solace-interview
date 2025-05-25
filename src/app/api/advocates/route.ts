import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const searchTerm = searchParams.get("searchTerm");

  const query = db.select().from(advocates);
  if (searchTerm) {
    // TODO: searchTerm needs to be sanitized, and is open to sql injection atm. For example the apostraphe in "men's health" blows up the query
    // via: https://stackoverflow.com/a/72281859/12022691
    // via: https://orm.drizzle.team/docs/sql#sql-in-where
    // via: https://orm.drizzle.team/docs/guides/postgresql-full-text-search
    query.where(
      sql`to_tsvector('english', 
        ${advocates.firstName} || ' ' ||
        ${advocates.lastName} || ' ' ||
        ${advocates.city} || ' ' ||
        ${advocates.degree} || ' ' ||
        ${advocates.yearsOfExperience} || ' ' ||
        ${advocates.specialties}
      ) @@ to_tsquery('english', ${`'${searchTerm}':*`})` // `:*` enables prefix-matching so we can do partial matches, as long as it's the first part of the word. i.e. `jon -> Jonathan` but NOT `ily -> Emily`
    );
  }

  const data = await query;

  return Response.json({ data });
}
