import axios from "axios";
import { useAuth } from "@clerk/react";
import { appConfig } from "@/config/app";

export function useSuperAllianceApi() {
  const { getToken } = useAuth();
  const api = axios.create({
    baseURL: appConfig.apiUrl,
  });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getForms = async (eventCode: string) => {
    try {
      const res = await api.get(
        `/forms/stand/${eventCode}`
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
        `/teams/${year}/${eventCode}`
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
        `/listEvents/${team}/${year}`
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
        `/event/${eventCode}/match/${matchNumber}/teams`
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
        `/event/${eventCode}/opr`
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
        `/form/stand/${id}`
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
        `/form/pit/${eventCode}/${team}`
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
        `/aggregation/all`
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
        `/aggregation/event/${eventId}`
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
        `/forms/comments`
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
        `/settings/app`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Settings not found!");
    }
  };

  const queryScoutingAssistant = async (userPrompt: string, event: string) => {
    try {
      const res = await api.post(`/ai/query`, { userPrompt, event });
      return res.data.answer as string;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.error || "The scouting query failed.");
      }
      throw new Error("The scouting query failed.");
    }
  };

  const getTeamSelection = async (year: string, eventCode: string) => {
    try {
      const res = await api.get(
        `/teamSelection/${year}/${eventCode}`
      );
      const data = res.data;
      return data;
    } catch {
      throw new Error("Team Selection not found");
    }
  };

  const saveTeamSelection = async (year: string, eventCode: string, teams: any[]) => {
    try {
      const res = await api.post(
        `/teamSelection/${year}/${eventCode}`,
        { teams }
      );
      return res.data;
    } catch {
      throw new Error("Failed to save team selection");
    }
  };

  const getMatchData = async (eventCode: string, matchNumber: number) => {
    try {
      const res = await api.get(
        `/event/${eventCode}/match/${matchNumber}/data`
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
        `/event/${eventCode}/team/${team}/rank`
      );
      const data = res.data.qual.ranking.rank;
      return data;
    } catch {
      throw new Error("Team Rank not found");
    }
  }

  const exportTeamSelection = async (year: string, eventCode: string) => {
    try {
      const res = await api.get(
        `/teamSelection/${year}/${eventCode}/report`,
        { responseType: 'blob' }
      );
      return res.data;
    } catch {
      throw new Error("Failed to export team selection");
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
    queryScoutingAssistant,
    getTeamSelection,
    saveTeamSelection,
    exportTeamSelection,
    getMatchData,
    getEventTeamRank,
    api
  }
};
