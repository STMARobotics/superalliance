import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { cn } from "@/lib/utils";
import { AspectRatio, Badge, Button, Modal } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import { Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function FormList({
  forms,
  selectedForm,
  setSelectedForm,
  teamsPage,
  selectedEvent,
}: {
  forms: any;
  selectedForm: any;
  setSelectedForm: any;
  teamsPage: any;
  selectedEvent?: any;
}) {
  const { eventTeams } = useSuperAlliance();
  const [youtubeLink, setYoutubeLink] = useState<any>();

  const [opened, setOpened] = useState<boolean>(false);
  const { getMatchData } = useSuperAllianceApi();

  const handleYoutube = (matchNumber: any) => {
    (async function () {
      const data = await getMatchData(selectedEvent, matchNumber);
      const video = data?.videos[0]?.key;
      if (video) {
        setOpened(true);
        setYoutubeLink(video);
      } else {
        toast.error("No YouTube video found for this match");
      }
    })();
  };
  return (
    <div className="flex flex-col gap-2 p-4 pt-0">
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="auto"
        withCloseButton={false}
        centered
      >
        <AspectRatio ratio={16 / 9} h={"65vh"} w={"65vw"}>
          <iframe
            src={`https://www.youtube.com/embed/${youtubeLink}`}
            title="YouTube video player"
            style={{ border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </AspectRatio>
      </Modal>
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
                <div className="font-semibold">
                  Team #{item.teamNumber}
                  {selectedEvent !== "none"
                    ? ` - Match #${item.matchNumber}`
                    : null}
                </div>
              </div>
              <div
                className={cn(
                  "ml-auto text-xs flex justify-center items-center gap-2",
                  selectedForm === item._id && !teamsPage
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                <Badge variant={"filled"} color={item.win ? "green" : "red"}>
                  {item.win ? "WIN" : "LOSS"}
                </Badge>
                <Button
                  onClick={() => {
                    handleYoutube(item.matchNumber);
                  }}
                  size="xs"
                >
                  <Youtube size={14} />
                </Button>
              </div>
            </div>
            <div className="text-xs font-medium">
              {eventTeams?.length > 0 &&
                `${
                  eventTeams?.filter(
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
