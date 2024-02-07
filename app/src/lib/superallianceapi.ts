export const getForms = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/stand`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};

export const getTeams = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listTeams`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
};

export const getEvents = async (team: string, year: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listEvents/${team}/${year}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("No events found");
  }
};

export const getFormById = async (id: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/form/stand/${id}`,
      { method: "GET" }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("Form not found");
  }
};

export const getPitFormByTeam = async (team: string) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/form/pit/${team}`,
      { method: "GET" }
    );
    const data = await res.json();
    return data;
  } catch {
    throw new Error("Form not found");
  }
};

export const getTotalAggregation = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/aggregation/all`,
      { method: "GET" }
    );
    const data = await res.json();
    return data;
  } catch {
    throw new Error("Aggregation not found");
  }
};

export const getEventAggregation = async (eventId: String) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/aggregation/event/${eventId}`,
      { method: "GET" }
    );
    const data = await res.json();
    return data;
  } catch {
    throw new Error("Aggregation not found");
  }
};

export const getAppSettings = async () => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/settings/app`,
      { method: "GET" }
    );
    const data = await res.json();
    return data;
  } catch {
    throw new Error("Settings not found!");
  }
};
