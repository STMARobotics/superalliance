import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";

//Clerk Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      publishableKey={PUBLISHABLE_KEY}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
