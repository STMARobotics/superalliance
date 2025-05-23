import { Accordion, Card, Image } from "@mantine/core";
import { Route } from "lucide-react";

const SelectionMiddleNotesPath = ({
  middleNotes,
  allianceData,
  fullWidth,
}: {
  middleNotes: any[];
  allianceData: any;
  fullWidth: boolean;
}) => {
  const positions = [
    { t: "14%", l: "49.2%" },
    { t: "31.3%", l: "49.2%" },
    { t: "48.2%", l: "49.2%" },
    { t: "65.4%", l: "49.2%" },
    { t: "82.4%", l: "49.2%" },
  ];

  return (
    <div className="space-y-2">
      <Accordion>
        {allianceData &&
          middleNotes.map((note, index) => {
            return (
              <div key={index}>
                {note.autoMiddleNotes?.length > 0 && (
                  <Accordion.Item
                    w={fullWidth ? "100vw" : "60vw"}
                    key={index}
                    value={`${index}`}
                    className={`flex flex-col justify-center items-center`}
                  >
                    <Accordion.Control icon={<Route />}>
                      Match #{note.matchNumber} Autonomous Note Path
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Card
                        key={index}
                        className={`h-full w-[${
                          fullWidth ? "100vw" : "55vw"
                        }]`}
                      >
                        <Image
                          fit="contain"
                          radius={"md"}
                          mah={"100%"}
                          className="rotate-180"
                          src={`https://raw.githubusercontent.com/wpilibsuite/allwpilib/main/fieldImages/src/main/native/resources/edu/wpi/first/fields/2024-field.png`}
                        />
                        {allianceData?.filter(
                          (alliance: any) =>
                            alliance.matchNumber == note.matchNumber
                        )[0].alliance === "red" ? (
                          <>
                            <div
                              style={{
                                position: "absolute",
                                top: "63.7%",
                                left: "10%",
                                width: "1rem",
                                height: "1rem",
                                backgroundColor: "red",
                                borderRadius: "50%",
                              }}
                            />
                            {note.autoMiddleNotes.map((pos: any, i: any) => {
                              return (
                                <div key={i}>
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
                                        i == 0
                                          ? "10%"
                                          : positions[
                                              Number(
                                                note.autoMiddleNotes[i - 1]
                                              ) - 1
                                            ].l
                                      }
                                      y1={
                                        i == 0
                                          ? "63.7%"
                                          : positions[
                                              Number(
                                                note.autoMiddleNotes[i - 1]
                                              ) - 1
                                            ].t
                                      }
                                      x2={positions[Number(pos) - 1].l}
                                      y2={positions[Number(pos) - 1].t}
                                      style={{ stroke: "red", strokeWidth: 2 }}
                                    />
                                  </svg>
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: `${positions[Number(pos) - 1].t}`,
                                      left: `${positions[Number(pos) - 1].l}`,
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
                                top: "63.7%",
                                left: "88%",
                                width: "1rem",
                                height: "1rem",
                                backgroundColor: "blue",
                                borderRadius: "50%",
                              }}
                            />
                            {note.autoMiddleNotes.map((pos: any, i: any) => {
                              return (
                                <div key={i}>
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
                                        i == 0
                                          ? "88%"
                                          : positions[
                                              Number(
                                                note.autoMiddleNotes[i - 1]
                                              ) - 1
                                            ].l
                                      }
                                      y1={
                                        i == 0
                                          ? "63.7%"
                                          : positions[
                                              Number(
                                                note.autoMiddleNotes[i - 1]
                                              ) - 1
                                            ].t
                                      }
                                      x2={positions[Number(pos) - 1].l}
                                      y2={positions[Number(pos) - 1].t}
                                      style={{ stroke: "blue", strokeWidth: 2 }}
                                    />
                                  </svg>
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: `${positions[Number(pos) - 1].t}`,
                                      left: `${positions[Number(pos) - 1].l}`,
                                      width: "1rem",
                                      height: "1rem",
                                      backgroundColor: "blue",
                                      borderRadius: "50%",
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </>
                        )}
                      </Card>
                    </Accordion.Panel>
                  </Accordion.Item>
                )}
              </div>
            );
          })}
      </Accordion>
    </div>
  );
};

export default SelectionMiddleNotesPath;
