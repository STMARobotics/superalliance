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
