import { getMatchData } from "@/lib/superallianceapi";
import {
  Button,
  Avatar,
  Card,
  Center,
  Group,
  Text,
  rem,
  Modal,
  AspectRatio,
} from "@mantine/core";
import { Link, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SelectionComments = ({
  comments,
  selectedEvent,
}: {
  comments: any[];
  selectedEvent: any;
}) => {
  const [youtubeLink, setYoutubeLink] = useState<any>();

  const [opened, setOpened] = useState<boolean>(false);

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
      {comments.map((match: any, index: any) => (
        <div key={index}>
          {match.comments && (
            <div key={index}>
              <Card withBorder radius="md" className={"relativ"}>
                <Text
                  className={`block mb-[${rem("5px")}]`}
                  fw={500}
                  component="a"
                >
                  Match: {match.matchNumber}
                </Text>

                <Text fz="sm" c="dimmed">
                  {match.comments}
                </Text>

                <Group justify="space-between" className={`mt-[1rem]`}>
                  <Center>
                    <Avatar size={24} radius="xl" mr="xs" color="red">
                      {(() => {
                        let rgx = new RegExp(/(\p{L}{1})\p{L}+/u, "gu");

                        let initials = [...match.usersName.matchAll(rgx)];

                        initials = (
                          (initials.shift()?.[1] || "") +
                          (initials.pop()?.[1] || "")
                        ).toUpperCase();

                        return initials;
                      })()}
                    </Avatar>
                    <Text fz="sm" inline>
                      {match.usersName}
                    </Text>
                  </Center>

                  <Group gap={8} mr={0}>
                    <Button
                      component="a"
                      target="_blank"
                      href={`/data/form/stand/${match.formId}`}
                      rightSection={<Link size={12} />}
                      size="xs"
                      className="bg-white text-black hover:bg-white hover:text-black"
                    >
                      Form
                    </Button>
                    <Button
                      onClick={() => {
                        handleYoutube(match.matchNumber);
                      }}
                      rightSection={<Youtube size={12} />}
                      size="xs"
                    >
                      Video
                    </Button>
                  </Group>
                </Group>
              </Card>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectionComments;
