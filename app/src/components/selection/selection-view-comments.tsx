import { Button, Avatar, Card, Center, Group, Text, rem } from "@mantine/core";
import { Link } from "lucide-react";

const SelectionComments = ({ comments }: { comments: any[] }) => {
  return (
    <div className="space-y-2">
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

                <Text fz="sm" c="dimmed" lineClamp={4}>
                  {match.comments}
                </Text>

                <Group justify="space-between" className={`mt-[1rem]`}>
                  <Center>
                    <Avatar size={24} radius="xl" mr="xs" color="red">
                      {(() => {
                        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

                        let initials = [...match.usersName.matchAll(rgx)] || [];

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
                      rightSection={<Link size={14} />}
                    >
                      Go to Form
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
