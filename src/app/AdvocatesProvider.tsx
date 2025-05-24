"use client";

import { Advocate } from "@/db/schema";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type AdvocatesContextType = { advocates: Advocate[] };

const AdvocatesContext = React.createContext<AdvocatesContextType>({
  advocates: [],
});

export const AdvocatesProvider = ({ children }: PropsWithChildren) => {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);

  /** Hydrate advocates (once) */
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/advocates");
      const json = await response.json();
      setAdvocates(json.data);
    })();
  }, []);

  return (
    <AdvocatesContext.Provider value={{ advocates }}>
      {children}
    </AdvocatesContext.Provider>
  );
};

export const useAdvocatesContext = () => useContext(AdvocatesContext);
