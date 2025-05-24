# Observations

## Database/Models

- `drizzle-orm` is up to 0.43.1 now but this is on 0.32.1. Upgrading could unlock the `casing: "snake_case"` config to reduce `firstName: text("first_name")` duplication
- `phoneNumber` as a `bitInt()` might not support Exensions very well
- `specialties` is a jsonb. Can easily convert that to a new Table
- `degree` could be a table too, making searches more consistent. We'll call that a stretch goal.
- I'd prefer to reorganize the Schema into `schema/advocate.ts` and `schema/patient.ts` and so on, but not sure if 0.32.1 supports that OOTB like 0.43.1 does. With more recent Drizzle updates it's a drop-in replacement because drizzle can differentiate between `schema.ts` and `schema/*.ts` with 0 config.

## React

- I'm not versed on Next.js so I'll have to figure out what works. For example, does Context work just the same, which will allow me to split out the data layer into its own unit of responsibility?
  - [This](https://nextjs.org/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components) was insightful. Looks like I can just use Context as normal.
- Kind of want to avoid libraries like MUI/Styled/etc in the interest of time. Nothing here is complex enough to necessitate advanced features from those. Looks like Tailwind can guide most of the styling then bare state manipulation (in an isolated layer) can do most of the rest.
- Would be great to find a useFetch library. I'm so used to useQuery I'm not sure if there's an idiomatic useFetch library but it would beat useState+useEffect backfill

## Things I'm unsure about

- Next.js vs React.js quirks
  - For the most part it looks like `"use client"` means I can operate as normal.
- Routing/API calls
  - I've used

## TODOs

- [ ] Prettify Table
- [ ] Format Phone Number
- [ ] Right-size the Years of Experience column (huge header, 2-char data)
- [ ] Convert Specialties into Tags or something (maybe store a color in the db)
  - [ ] Specialties Admin Panel
- Functionality:
  - [ ] Search
  - [ ] Add
  - [ ] Delete
  - [ ] View/Click in to (reuse add?)
- [ ] Bold/Highlight Specialties when it matches the Search Term. i.e. searching for "post-partum" should draw the user's attention to that match in the Specialties column
- Stub out a "Match me with a Provider" UI
