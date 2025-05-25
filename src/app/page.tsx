"use client";

import { useMemo, useState } from "react";
import { useAdvocatesContext } from "./AdvocatesProvider";

export default function Home() {
  const { advocates } = useAdvocatesContext();
  const [searchTerm, setSearchTerm] = useState("");

  // TODO: For client-side search, could be good to debounce setSearchTerm so this useMemo
  // doesn't run on every keystroke.
  const filteredAdvocates = useMemo(() => {
    // Compiling RegExp is expensive so do it once up here and reuse instead of over and over again inline
    const caseInsensitiveSearch = new RegExp(searchTerm, "i");
    return !searchTerm
      ? advocates
      : advocates.filter(
          (advocate) =>
            advocate.firstName.match(caseInsensitiveSearch) ||
            advocate.lastName.match(caseInsensitiveSearch) ||
            advocate.city.match(caseInsensitiveSearch) ||
            advocate.degree.match(caseInsensitiveSearch) ||
            advocate.specialties.some((specialty) =>
              specialty.match(caseInsensitiveSearch)
            ) ||
            advocate.yearsOfExperience.toString().match(caseInsensitiveSearch)
        );
  }, [searchTerm, advocates]);

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button onClick={() => setSearchTerm("")}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate) => (
            <tr key={advocate.id}>
              <td>{advocate.firstName}</td>
              <td>{advocate.lastName}</td>
              <td>{advocate.city}</td>
              <td>{advocate.degree}</td>
              <td>
                {/* TODO: Highlight/Bold a term when it matches SearchTerm */}
                {advocate.specialties.map((s) => (
                  <div key={s}>{s}</div>
                ))}
              </td>
              <td>{advocate.yearsOfExperience}</td>
              <td>{advocate.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
