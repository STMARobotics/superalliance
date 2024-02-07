import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { cn } from "@/lib/utils";
import { Badge } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";

function FormList({
  forms,
  selectedForm,
  setSelectedForm,
  teamsPage,
}: {
  forms: any;
  selectedForm: any;
  setSelectedForm: any;
  teamsPage: any;
}) {
  const { teams } = useSuperAlliance();
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      {forms.map((item: any, index: any) => (
        <button
          key={index}
          className={cn(
            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent]",
            selectedForm === item._id && !teamsPage && "bg-muted"
          )}
          onClick={() => setSelectedForm(item._id)}
        >
          <div className="flex w-full flex-col gap-1">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="font-semibold">Team #{item.teamNumber}</div>
              </div>
              <div
                className={cn(
                  "ml-auto text-xs",
                  selectedForm && !teamsPage === item._id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Badge variant={"filled"} color={item.win ? "green" : "red"}>
                  {item.win ? "WIN" : "LOSS"}
                </Badge>
              </div>
            </div>
            <div className="text-xs font-medium">
              {teams?.length > 0 &&
                `${
                  teams?.filter(
                    (team: any) => team.teamNumber == item.teamNumber
                  )[0]?.teamName
                } • `}
              {item.usersName}
            </div>
          </div>
          <div className="line-clamp-2 text-xs text-muted-foreground">
            RP Earned: {item.rpEarned} •{" "}
            {formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
            })}
          </div>
          <div>
            {item.criticals.length ? (
              <div className="flex items-center gap-2 flex-wrap">
                {item.criticals.map((critical: any) => (
                  <Badge
                    key={critical}
                    variant={getBadgeVariantFromLabel(critical)}
                  >
                    {critical}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}

export default FormList;

function getBadgeVariantFromLabel(label: string) {
  if (["robot died", "mechanism broke"].includes(label.toLowerCase())) {
    return "destructive";
  }

  return "default";
}
