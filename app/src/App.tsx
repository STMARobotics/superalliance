import AppRouter from "./AppRouter";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { cn } from "./lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { MantineProvider } from "@mantine/core";
import { SuperAllianceProvider } from "@/contexts/SuperAllianceProvider";

function App() {
  return (
    <div className={cn("min-h-screen bg-background font-sans antialiased")}>
      <div className="relative flex min-h-screen flex-col bg-background text-white">
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster richColors theme="dark" />
          <MantineProvider
            defaultColorScheme="dark"
            theme={{ primaryColor: "red" }}
          >
            <SuperAllianceProvider>
              <div className="flex-1">
                <AppRouter />
              </div>
            </SuperAllianceProvider>
          </MantineProvider>
        </ThemeProvider>
      </div>
    </div>
  );
}

export default App;
