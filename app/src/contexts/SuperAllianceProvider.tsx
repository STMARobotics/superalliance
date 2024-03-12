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
  badComments?: any;
  appSettings?: any;
  setSelectedEvent?: any;
  refreshSA?: {
    all: () => void;
    forms: () => void;
    teams: () => void;
    events: () => void;
    totalAggregation: () => void;
    appSettings: () => void;
    eventData: () => void;
  };
  loading?: boolean;
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
  const [selectedEvent, setSelectedEvent] = useState<any>("all");
  const [loading, setLoading] = useState<boolean>(true);

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
    eventData: () => {
      (async function () {
        if (selectedEvent && selectedEvent !== "all") {
          const eventForms = await getForms();
          setEventForms(
            eventForms.filter((form: any) => form.event === selectedEvent)
          );
          const eventTeams = await getTeams();
          setEventTeams(
            eventTeams.filter((team: any) =>
              team.teamEvent.includes(selectedEvent)
            )
          );
          const eventAggregation = await getEventAggregation(selectedEvent);
          setEventAggregation(eventAggregation);
        }
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
    loading,
  };

  useEffect(() => {
    (async function () {
      const appSettingsRes = await getAppSettings();
      setAppSettings(appSettingsRes);
      if (appSettingsRes?.event && appSettingsRes?.event !== "none")
        setSelectedEvent(appSettingsRes?.event);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (selectedEvent && selectedEvent !== "all") {
        const [eventForms, eventTeams, eventAggregation] = await Promise.all([
          getForms(),
          getTeams(),
          getEventAggregation(selectedEvent),
        ]);
        setEventForms(
          eventForms.filter((form: any) => form.event === selectedEvent)
        );
        setEventTeams(
          eventTeams.filter((team: any) =>
            team.teamEvent.includes(selectedEvent)
          )
        );
        setEventAggregation(eventAggregation);
        setLoading(false);
      }
    })();
  }, [selectedEvent]);

  useEffect(() => {
    (async function () {
      const appSettingsRes = await getAppSettings();
      const [forms, teams, events, totalAggregation] = await Promise.all([
        getForms(),
        getTeams(),
        getEvents(appConfig.teamNumber, appConfig.year),
        getTotalAggregation(),
      ]);
      setForms(forms);
      setTeams(teams);
      setEvents(events);
      setTotalAggregation(totalAggregation);
      if (appSettingsRes?.event && appSettingsRes?.event == "none")
        setLoading(false);
    })();
  }, []);

  return (
    <SuperAllianceContext.Provider value={value}>
      {children}
    </SuperAllianceContext.Provider>
  );
}

export const useSuperAlliance = () => useContext(SuperAllianceContext);
