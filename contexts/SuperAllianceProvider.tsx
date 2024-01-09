"use client";

import { getEvents, getForms } from "@/lib/superallianceapi";
import { createContext, use, useContext, useEffect, useState } from "react";
import { appConfig } from "@/config/app";

type SuperAllianceContextProps = {
  forms?: any;
  events?: any;
  selectedEvent?: any;
  setSelectedEvent?: any;
};

const SuperAllianceContext = createContext<SuperAllianceContextProps>({});

export function SuperAllianceProvider(props: any) {
  const { children } = props;

  const [forms, setForms] = useState(null);
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const value = {
    forms,
    events,
    selectedEvent,
    setSelectedEvent,
  };

  useEffect(() => {
    (async function () {
      setForms(await getForms());
      setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
    })();
  }, []);

  return (
    <SuperAllianceContext.Provider value={value}>
      {children}
    </SuperAllianceContext.Provider>
  );
}

export const useSuperAlliance = () => useContext(SuperAllianceContext);
