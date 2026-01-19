import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

export function useSuperAllianceApi() {
  const { getToken } = useAuth();
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken({template: "API"});
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getForms = async (eventCode: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/forms/stand/${eventCode}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("No forms found");
    }
  };

  const getTeams = async (year: string, eventCode: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/teams/${year}/${eventCode}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("No teams found");
    }
  };

  const getEvents = async (team: string, year: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/listEvents/${team}/${year}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("No events found");
    }
  };

  const getTeamsFromMatch = async (
    eventCode: string,
    matchNumber: number
  ) => {
    try {
      const res = await api.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/event/${eventCode}/match/${matchNumber}/teams`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("Teams not found");
    }
  };

  const getOPRData = async (eventCode: string, team: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/event/${eventCode}/opr`
      );
      const data = res.data.oprs[`frc${team}`];
      return data;
    } catch (err) {
      throw new Error("OPR not found");
    }
  }

  const getFormById = async (id: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/form/stand/${id}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("Form not found");
    }
  };

  const getPitFormByTeam = async (eventCode: string, team: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/form/pit/${eventCode}/${team}`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Form not found");
    }
  };

  const getTotalAggregation = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/aggregation/all`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Aggregation not found");
    }
  };

  const getEventAggregation = async (eventId: String) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/aggregation/event/${eventId}`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Aggregation not found");
    }
  };

  const getBadComments = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/forms/comments`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Comments not found");
    }
  };

  const getAppSettings = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/settings/app`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Settings not found!");
    }
  };

  const getTeamSelection = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/teamSelection`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Team Selection not found");
    }
  };

  const getMatchData = async (eventCode: string, matchNumber: number) => {
    try {
      const res = await api.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/event/${eventCode}/match/${matchNumber}/data`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Match Data not found");
    }
  };

  const getEventTeamRank = async (eventCode: string, team: any) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/event/${eventCode}/team/${team}/rank`
      );
      const data = res.data.qual.ranking.rank;
      return data;
    } catch {
      throw new Error("Team Rank not found");
    }
  }

  const getQuantFormById = async (id: string) => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/form/standquant/${id}`
      );
      const data = res.data;
      return data;
    } catch (err) {
      throw new Error("Quant Stand Form not found");
    }
  };

  return {
    getForms,
    getTeams,
    getEvents,
    getTeamsFromMatch,
    getOPRData,
    getFormById,
    getPitFormByTeam,
    getTotalAggregation,
    getEventAggregation,
    getBadComments,
    getAppSettings,
    getTeamSelection,
    getMatchData,
    getEventTeamRank,
    getQuantFormById,
    api
  }
};
