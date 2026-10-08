import AdminSettingsForm from "@/components/admin/admin-settings";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { LoadingOverlay } from "@mantine/core";

function AdminSettings() {
  const { events, appSettings } = useSuperAlliance();

  return (
    <div className="relative h-full w-full">
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
  );
}

export default AdminSettings;
