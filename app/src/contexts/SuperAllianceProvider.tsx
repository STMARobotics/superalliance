"use client";

import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { createContext, useContext, useEffect, useState } from "react";
import { appConfig } from "@/config/app";
import { useUser } from "@clerk/clerk-react";

type SuperAllianceContextProps = {
  events?: any;
  eventForms?: any;
  eventTeams?: any;
  eventAggregation?: any;
  selectedEvent?: any;
  badComments?: any;
  appSettings?: any;
  setSelectedEvent?: any;
  refreshSA?: {
    all: () => void;
    appSettings: () => void;
    eventData: () => void;
  };
  loading?: boolean;
};

const SuperAllianceContext = createContext<SuperAllianceContextProps>({});

export function SuperAllianceProvider(props: any) {
  const { children } = props;

  const [events, setEvents] = useState<any>(null);
  const [eventForms, setEventForms] = useState<any>(null);
  const [eventTeams, setEventTeams] = useState<any>(null);
  const [eventAggregation, setEventAggregation] = useState<any>(null);
  const [appSettings, setAppSettings] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>("none");
  const [loading, setLoading] = useState<boolean>(true);
  const { getForms, getTeams, getEvents, getEventAggregation, getAppSettings } = useSuperAllianceApi();
  const { user } = useUser();

  const refreshSA = {
    all: () => {
      (async function () {
        setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
        setAppSettings(await getAppSettings());
      })();
    },
    events: () => {
      (async function () {
        setEvents(await getEvents(appConfig.teamNumber, appConfig.year));
      })();
    },
    appSettings: () => {
      (async function () {
        setAppSettings(await getAppSettings());
      })();
    },
    eventData: () => {
      (async function () {
        if (selectedEvent && selectedEvent !== "none") {
          const eventTeams = await getTeams(appConfig.year, selectedEvent);
          setEventTeams(
            eventTeams.filter((team: any) =>
              team.teamEvent.includes(selectedEvent)
            )
          );
          if (user?.publicMetadata.role === "admin") {
            const eventForms = await getForms(selectedEvent);
            setEventForms(
              eventForms.filter((form: any) => form.event === selectedEvent)
            );
            const eventAggregation = await getEventAggregation(selectedEvent);
            setEventAggregation(eventAggregation);
          }
        }
      })();
    },
  };

  const value = {
    events,
    eventForms,
    eventTeams,
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
      const events = await getEvents(appConfig.teamNumber, appConfig.year);
      setEvents(events);
      if (appSettingsRes?.event && appSettingsRes?.event !== "none")
        setSelectedEvent(appSettingsRes?.event);
    })();
  }, []);

  useEffect(() => {
    (async function () {
      if (selectedEvent && selectedEvent !== "none") {
        if (user?.publicMetadata.role === "admin") {
          const eventTeams = await getTeams(appConfig.year, selectedEvent);
          setEventTeams(eventTeams);
          const eventForms = await getForms(selectedEvent);
          setEventForms(eventForms);
          const eventAggregation = await getEventAggregation(selectedEvent);
          setEventAggregation(eventAggregation);
        }
        setLoading(false);
      }
    })();
  }, [selectedEvent]);

  return (
    <SuperAllianceContext.Provider value={value}>
      {children}
    </SuperAllianceContext.Provider>
  );
}

export const useSuperAlliance = () => useContext(SuperAllianceContext);
