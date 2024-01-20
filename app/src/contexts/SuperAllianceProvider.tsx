"use client";

import { getEvents, getForms, getTeams } from "@/lib/superallianceapi";
import { createContext, useContext, useEffect, useState } from "react";
import { appConfig } from "@/config/app";

type SuperAllianceContextProps = {
  forms?: any;
  teams?: any;
  events?: any;
  selectedEvent?: any;
  setSelectedEvent?: any;
};

const SuperAllianceContext = createContext<SuperAllianceContextProps>({});

export function SuperAllianceProvider(props: any) {
  const { children } = props;

  const [forms, setForms] = useState(null);
  const [teams, setTeams] = useState(null);
  const [events, setEvents] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState("All Events");

  const value = {
    forms,
    teams,
    events,
    selectedEvent,
    setSelectedEvent,
  };

  useEffect(() => {
    (async function () {
      setForms(await getForms());
      setTeams(await getTeams());
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
