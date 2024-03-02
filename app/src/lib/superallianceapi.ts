import axios from "axios";

export const getForms = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/forms/stand`
    );
    const data = res.data;
    return data;
  } catch (err) {
    throw new Error("No forms found");
  }
};

export const getTeams = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/listTeams`
    );
    const data = res.data;
    return data;
  } catch (err) {
    throw new Error("No teams found");
  }
};

export const getEvents = async (team: string, year: string) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/listEvents/${team}/${year}`
    );
    const data = res.data;
    return data;
  } catch (err) {
    throw new Error("No events found");
  }
};

export const getFormById = async (id: string) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/form/stand/${id}`
    );
    const data = res.data;
    return data;
  } catch (err) {
    throw new Error("Form not found");
  }
};

export const getPitFormByTeam = async (team: string) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/form/pit/${team}`
    );
    const data = res.data;
    return data;
  } catch {
    throw new Error("Form not found");
  }
};

export const getTotalAggregation = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/aggregation/all`
    );
    const data = res.data;
    return data;
  } catch {
    throw new Error("Aggregation not found");
  }
};

export const getEventAggregation = async (eventId: String) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/aggregation/event/${eventId}`
    );
    const data = res.data;
    return data;
  } catch {
    throw new Error("Aggregation not found");
  }
};

export const getAppSettings = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/settings/app`
    );
    const data = res.data;
    return data;
  } catch {
    throw new Error("Settings not found!");
  }
};
