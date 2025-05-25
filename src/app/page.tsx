"use client";

import { PropsWithChildren, useState } from "react";
import { useAdvocatesContext } from "./AdvocatesProvider";

/** Focuses on searchTerm management and laying out the components */
export default function Home() {
  const { searchTerm, setSearchTerm } = useAdvocatesContext();
  return (
    <>
      <div className="flex justify-between items-center pb-4">
        <h1 className="text-3xl">Solace Advocates</h1>
        <div className="flex">
          {searchTerm && (
            <button
              className="mx-2 px-2 py-1 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm text-nowrap rounded-md"
              onClick={() => setSearchTerm("")}
            >
              Reset Search
            </button>
          )}
          <input
            aria-label="Search"
            placeholder="Search..."
            className="block bg-white w-full border border-slate-300 rounded-md p-2 shadow-sm placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>
      </div>
      <AdvocatesTable />
    </>
  );
}

/** Renders a Table from the advocates Provider. Also shows a "No results..." experience when a search returned nothing */
const AdvocatesTable = () => {
  const { advocates, searchTerm, setSearchTerm } = useAdvocatesContext();

  // "No result" UX if the search returned no results
  if (searchTerm && advocates.length === 0) {
    return (
      <>
        <div>No results to show for "{searchTerm}"...</div>
        <button
          // Eh... UI could be better here. Looks a little cheap.
          className="mx-2 px-2 py-1 font-semibold text-sm bg-sky-500 text-white rounded-none shadow-sm"
          onClick={() => setSearchTerm("")}
        >
          Clear
        </button>
      </>
    );
  }

  return (
    <table className="border-collapse table-auto w-full text-sm rounded-xl">
      <caption
        className="caption-top pb-2"
        // Keep caption in the DOM so the table doesn't jerk "down" when you start searching
        style={{ visibility: searchTerm ? "visible" : "hidden" }}
      >
        Filters applied. Not all advocates may be shown...
      </caption>
      <thead className="bg-slate-50 dark:bg-slate-700">
        <tr>
          <TableHeaderCell>First Name</TableHeaderCell>
          <TableHeaderCell>Last Name</TableHeaderCell>
          <TableHeaderCell>City</TableHeaderCell>
          <TableHeaderCell>Degree</TableHeaderCell>
          <TableHeaderCell>Specialties</TableHeaderCell>
          <TableHeaderCell>Years of Experience</TableHeaderCell>
          <TableHeaderCell>Phone Number</TableHeaderCell>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-slate-800">
        {advocates.map((advocate) => (
          <tr key={advocate.id}>
            <TableDataCell>{advocate.firstName}</TableDataCell>
            <TableDataCell>{advocate.lastName}</TableDataCell>
            <TableDataCell>{advocate.city}</TableDataCell>
            <TableDataCell>{advocate.degree}</TableDataCell>
            <TableDataCell>
              {/* TODO: Highlight/Bold a term when it matches SearchTerm */}
              <SpecialtiesList specialties={advocate.specialties} showMax={3} />
            </TableDataCell>
            <TableDataCell>{advocate.yearsOfExperience}</TableDataCell>
            <TableDataCell>
              {advocate.phoneNumber
                .toString()
                // 2345678910 --> (234) 567-8910
                .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
            </TableDataCell>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const TableHeaderCell = ({ children }: PropsWithChildren) => (
  <th className="border-b dark:border-slate-600 font-medium p-4 pl-8 py-3 text-slate-400 dark:text-slate-200 text-left">
    {children}
  </th>
);

const TableDataCell = ({ children }: PropsWithChildren) => (
  <td className="border-b border-slate-100 dark:border-slate-700 p-4 pl-8 text-slate-500 dark:text-slate-400">
    {children}
  </td>
);

type SpecialtiesListProps = {
  specialties: string[];
  /** Shows up to this many number of specialties. Beyond this number, it renders e.g. `+7 more...` */
  showMax: number;
};

/** Helps declutter a long list of Specialties by only showing up to showMax of them, then `"+7 more..."` the rest. */
const SpecialtiesList = ({ specialties, showMax }: SpecialtiesListProps) => {
  const [expand, setExpand] = useState(false);
  const specialtiesToRender = specialties.slice(
    0,
    // if the cell is being expanded, show everything.
    expand ? undefined : showMax
  );
  const numHidden = expand ? 0 : specialties.slice(showMax).length;
  // TODO: If one of these matches `searchTerm` then force it to render
  return (
    <div
      style={{ cursor: "pointer" }}
      // clickable divs are an a11y issue
      onClick={() => setExpand((state) => !state)}
    >
      {specialtiesToRender.map((specialty) => (
        <li key={specialty}>{specialty}</li>
      ))}
      {numHidden > 0 ? (
        // yeah we can workshop this
        <li> +{numHidden} more... (click to see)</li>
      ) : undefined}
    </div>
  );
};
