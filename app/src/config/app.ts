export const appConfig = {
  teamNumber: "7028",
  year: new Date().getFullYear().toString(),
  apiUrl: `${import.meta.env.VITE_API_URL || window.location.origin}/api`,
};

export type appConfig = typeof appConfig;
