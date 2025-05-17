import { AspectRatio, Badge, Modal } from "@mantine/core";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { toast } from "sonner";

const SelectionCriticals = ({
  criticals,
  selectedEvent,
}: {
  criticals: any[];
  selectedEvent: any;
}) => {
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
    <div className="space-y-2">
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
      {criticals.map((match: any, index: any) => (
        <div key={index}>
          {match.criticals?.length > 0 && (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Match #{match.matchNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-x-2">
                  {match.criticals?.map((crit: any, index: any) => {
                    return (
                      <Badge
                        key={index + 1}
                        color={"white"}
                        variant={"outline"}
                      >
                        {crit}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="justify-between space-x-2">
                <Button asChild className="w-full">
                  <Link target="_blank" to={`/data/form/stand/${match.formId}`}>
                    View Form
                  </Link>
                </Button>
                <Button
                  className="w-full bg-red-500 hover:bg-red-700 text-white"
                  onClick={() => {
                    handleYoutube(match.matchNumber);
                  }}
                >
                  View YouTube
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectionCriticals;
