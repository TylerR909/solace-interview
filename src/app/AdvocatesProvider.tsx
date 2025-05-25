"use client";

import { Advocate } from "@/db/schema";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AdvocatesContextType = {
  advocates: Advocate[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<string>;
};

const AdvocatesContext = React.createContext<AdvocatesContextType>({
  advocates: [],
  searchTerm: "",
  setSearchTerm() {},
});

export const AdvocatesProvider = ({ children }: PropsWithChildren) => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  /** Hydrate advocates */
  const debouncedSearchTerm = useDebounced(searchTerm);
  useEffect(() => {
    (async () => {
      const response = await fetch(
        `/api/advocates?searchTerm=${debouncedSearchTerm}`
      );
      const json = await response.json();
      setAdvocates(json.data);
    })();
  }, [debouncedSearchTerm]);

  return (
    <AdvocatesContext.Provider value={{ advocates, searchTerm, setSearchTerm }}>
      {children}
    </AdvocatesContext.Provider>
  );
};

export const useAdvocatesContext = () => useContext(AdvocatesContext);

/**
 * Debounces a rapidly-updating value (such as keystrokes) and "eventually" returns the settled
 * value. Usage: `const debouncedVal = useDebounced(val);`
 */
const useDebounced = <T extends unknown>(val: T, ms = 250) => {
  const [state, setState] = useState<T>(val);

  /** setState after `ms` timeout. If a new value comes in, cancel the timeout and make a new one. */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setState(val);
    }, ms);

    return () => clearTimeout(timeout);
  }, [val]);

  return state;
};
