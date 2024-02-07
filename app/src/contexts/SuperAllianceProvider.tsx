"use client";

import {
  getEvents,
  getForms,
  getAppSettings,
  getTeams,
  getTotalAggregation,
  getEventAggregation,
} from "@/lib/superallianceapi";
import { createContext, useContext, useEffect, useState } from "react";
import { appConfig } from "@/config/app";

type SuperAllianceContextProps = {
  forms?: any;
  teams?: any;
  events?: any;
  eventForms?: any;
  eventTeams?: any;
  totalAggregation?: any;
  eventAggregation?: any;
  selectedEvent?: any;
  appSettings?: any;
  setSelectedEvent?: any;
  refreshSA?: {
    all: () => void;
    forms: () => void;
    teams: () => void;
    events: () => void;
    totalAggregation: () => void;
    appSettings: () => void;
  };
};

const SuperAllianceContext = createContext<SuperAllianceContextProps>({});

export function SuperAllianceProvider(props: any) {
  const { children } = props;

  const [forms, setForms] = useState<any>(null);
  const [teams, setTeams] = useState<any>(null);
  const [events, setEvents] = useState<any>(null);
  const [eventForms, setEventForms] = useState<any>(null);
  const [eventTeams, setEventTeams] = useState<any>(null);
  const [totalAggregation, setTotalAggregation] = useState<any>(null);
  const [eventAggregation, setEventAggregation] = useState<any>(null);
  const [appSettings, setAppSettings] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>("All Events");

  const refreshSA = {
    all: () => {
      (async function () {
        setForms(await getForms());
        setTeams(await getTeams());
        setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
        setTotalAggregation(await getTotalAggregation());
        setAppSettings(await getAppSettings());
      })();
    },
    forms: () => {
      (async function () {
        setForms(await getForms());
      })();
    },
    teams: () => {
      (async function () {
        setTeams(await getTeams());
      })();
    },
    events: () => {
      (async function () {
        setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
      })();
    },
    totalAggregation: () => {
      (async function () {
        setTotalAggregation(await getTotalAggregation());
      })();
    },
    appSettings: () => {
      (async function () {
        setAppSettings(await getAppSettings());
      })();
    },
  };

  const value = {
    forms,
    teams,
    events,
    eventForms,
    eventTeams,
    totalAggregation,
    eventAggregation,
    selectedEvent,
    appSettings,
    setSelectedEvent,
    refreshSA,
  };

  useEffect(() => {
    (async function () {
      setForms(await getForms());
      setTeams(await getTeams());
      setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
      setTotalAggregation(await getTotalAggregation());
      setAppSettings(await getAppSettings());
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (appSettings?.event !== "none") {
        const eventForms = await getForms();
        const eventTeams = await getTeams();
        const eventAggregation = await getEventAggregation(appSettings?.event);
        setEventForms(
          eventForms.filter((form: any) => form.event === appSettings?.event)
        );
        setEventTeams(
          eventTeams.filter((team: any) => team.event === appSettings?.event)
        );
        setEventAggregation(eventAggregation);
        setSelectedEvent(appSettings?.event);
      }
    })();
  }, [appSettings]);

  return (
    <SuperAllianceContext.Provider value={value}>
      {children}
    </SuperAllianceContext.Provider>
  );
}

export const useSuperAlliance = () => useContext(SuperAllianceContext);
