import axios from "axios";

export const getForms = async () => {
  return (await axios.get("/api/forms")).data;
};

export const getEvents = async (team: string, year: string) => {
  try {
    const data = await axios.get(`/api/listEvents/${team}/${year}`);
    return data.data;
  } catch (err) {
    throw new Error("No events found");
  }
};

export const getFormById = async (id: string) => {
  try {
    const data = await axios.get(`/api/form/stand/${id}`);
    return data.data[0];
  } catch (err) {
    throw new Error("Form not found");
  }
};
