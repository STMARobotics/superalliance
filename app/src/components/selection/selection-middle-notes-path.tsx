import { Accordion, Card, Image } from "@mantine/core";
import { Route } from "lucide-react";

const SelectionMiddleNotesPath = ({
  middleNotes,
  alliance,
}: {
  middleNotes: any[];
  alliance: string;
}) => {
  const redPositions = [
    { t: "14%", l: "49.2%" },
    { t: "31.3%", l: "49.2%" },
    { t: "48.2%", l: "49.2%" },
    { t: "65.4%", l: "49.2%" },
    { t: "82.4%", l: "49.2%" },
  ];

  return (
    <div className="space-y-2">
      <Accordion>
        {middleNotes.map((note, index) => {
          return (
            <Accordion.Item
              key={index}
              value={`${note.matchNumber}`}
              className="w-[60vw] flex flex-col justify-center items-center"
            >
              <Accordion.Control icon={<Route />}>
                Match #{note.matchNumber} Autonomous Note Path
              </Accordion.Control>
              <Accordion.Panel>
                <Card key={index} className="h-[100%] w-[55vw]">
                  <Image
                    fit="contain"
                    radius={"md"}
                    mah={"100%"}
                    src={`https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/fieldImages/src/main/native/resources/edu/wpi/first/fields/2024-field.png`}
                  />
                  {alliance === "red" ? (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: "33.7%",
                          left: "86%",
                          width: "1rem",
                          height: "1rem",
                          backgroundColor: "red",
                          borderRadius: "50%",
                        }}
                      />
                      {note.autoMiddleNotes.map((pos: any, index: any) => {
                        return (
                          <div key={index}>
                            <svg
                              style={{
                                position: "absolute",
                                top: "0",
                                left: "0",
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <line
                                x1={
                                  pos == "1"
                                    ? "86%"
                                    : redPositions[
                                        Number(
                                          note.autoMiddleNotes[index - 1]
                                        ) - 1
                                      ].l
                                }
                                y1={
                                  pos == "1"
                                    ? "33.7%"
                                    : redPositions[
                                        Number(
                                          note.autoMiddleNotes[index - 1]
                                        ) - 1
                                      ].t
                                }
                                x2={redPositions[Number(pos) - 1].l}
                                y2={redPositions[Number(pos) - 1].t}
                                style={{ stroke: "red", strokeWidth: 2 }}
                              />
                            </svg>
                            <div
                              style={{
                                position: "absolute",
                                top: `${redPositions[Number(pos) - 1].t}`,
                                left: `${redPositions[Number(pos) - 1].l}`,
                                width: "1rem",
                                height: "1rem",
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            />
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#ff00ff",
                          borderRadius: "50%",
                        }}
                      />
                    </>
                  )}
                </Card>
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default SelectionMiddleNotesPath;
