import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IconUsersGroup } from "@tabler/icons-react";

function TeamList({
  teams,
  selectedTeam,
  setSelectedTeam,
}: {
  teams: any;
  selectedTeam: any;
  setSelectedTeam: any;
}) {
  return (
    <div className="p-5 h-screen">
      {teams?.map((team: any) => {
        return (
          <Card
            className={cn(
              "mb-5 cursor-pointer hover:bg-accent]",
              selectedTeam === team.teamNumber && "bg-muted"
            )}
            onClick={() => setSelectedTeam(team.teamNumber)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {team?.teamName}
              </CardTitle>
              <IconUsersGroup className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Team #{team.teamNumber}</div>
              <p className="text-xs text-muted-foreground">
                {team.teamLocation}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default TeamList;
