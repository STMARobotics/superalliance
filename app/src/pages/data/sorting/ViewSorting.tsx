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
      {selectedEvent == "all" ? (
        <>
          {totalAggregation && (
            <div className="h-full flex-col md:flex">
              <Sorting
                forms={forms}
                teams={teams}
                events={events}
                aggregation={totalAggregation}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {eventAggregation && (
            <div className="h-full flex-col md:flex">
              <Sorting
                forms={eventForms}
                teams={eventTeams}
                events={events}
                aggregation={eventAggregation}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default DataSorting;
