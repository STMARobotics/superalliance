import { AdminNav } from "@/components/admin/admin-nav";
import AdminSettingsForm from "@/components/admin/admin-settings";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { LoadingOverlay, em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function AdminSettings() {
  const { events, appSettings, refreshSA  } = useSuperAlliance();
  const pathname = useLocation().pathname;

  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  useEffect(() => {
    refreshSA!.appSettings();
  }, []);

  return (
    <div className="flex flex-row h-full">
      {isMobile ? (
        <div className="relative w-full h-full">
          {events?.length > 0 && appSettings ? (
            <AdminSettingsForm events={events} settings={appSettings} />
          ) : (
            <LoadingOverlay
              loaderProps={{ type: "dots", color: "white" }}
              visible
              zIndex={1000}
              overlayProps={{ color: "#000000", blur: 5 }}
            />
          )}
        </div>
      ) : (
        <>
          <div className="h-full w-[24vw]">
            <div className="h-[52px] flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Administration</h1>
            </div>
            <Separator />
            <AdminNav
              links={[
                {
                  title: "Settings",
                  icon: Settings,
                  variant: pathname == "/admin/settings" ? "default" : "ghost",
                  link: "/admin/settings",
                },
              ]}
            />
          </div>
          <Separator orientation="vertical" />
          <div className="relative w-full h-full">
            {events?.length > 0 && appSettings ? (
              <AdminSettingsForm events={events} settings={appSettings} />
            ) : (
              <LoadingOverlay
                loaderProps={{ type: "dots", color: "white" }}
                visible
                zIndex={1000}
                overlayProps={{ color: "#000000", blur: 5 }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminSettings;
