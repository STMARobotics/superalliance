import Sorting from "@/components/sorting/sorting";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

function DataSorting() {
  const {
    forms,
    teams,
    totalAggregation,
    events,
    selectedEvent,
    eventForms,
    eventTeams,
    eventAggregation,
  } = useSuperAlliance();

  return (
    <>
      {totalAggregation && (
        <div className="h-full flex-col md:flex">
          <Sorting
            forms={selectedEvent !== "all" ? eventForms : forms}
            teams={selectedEvent !== "all" ? eventTeams : teams}
            events={events}
            aggregation={
              selectedEvent !== "all" ? eventAggregation : totalAggregation
            }
          />
        </div>
      )}
    </>
  );
}

export default DataSorting;
