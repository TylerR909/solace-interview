import { NextRequest } from "next/server";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { eq, sql } from "drizzle-orm";

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

/** STUBBED api for what a Create/Update endpoint may do, though nothing in the app is calling iet yet */
export async function POST(req: NextRequest) {
  type NewAdvocate = typeof advocates.$inferInsert;
  const body: NewAdvocate = await req.json();
  // schema-validate body, then

  const {
    id,
    firstName,
    lastName,
    city,
    degree,
    phoneNumber,
    yearsOfExperience,
    specialties,
  } = body ?? {};

  let updatedAdvocates: any[];
  if (!id) {
    // CREATE
    updatedAdvocates = await db.insert(advocates).values({
      firstName,
      lastName,
      city,
      degree,
      phoneNumber,
      yearsOfExperience,
      specialties, // eventually specialties will be its own table
      // createdAt is handled by a default in the schema
    });
  } else {
    // UPDATE
    updatedAdvocates = await db.update(advocates).set({
      id,
      firstName,
      lastName,
      city,
      degree,
      phoneNumber,
      yearsOfExperience,
      specialties,
    });
  }

  // return an array to hint at eventually allowing bulk-updates
  return Response.json({ data: updatedAdvocates });
}

/** STUBBED API for what I'd guess a Delete endpoint would look like. Not implemented yet on Frontend, nor tested. */
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  await db.delete(advocates).where(eq(advocates.id, data.id));
  // return the now-deleted ID so FE can remove things from cache, tables, etc
  return Response.json({ data: data.id });
}
