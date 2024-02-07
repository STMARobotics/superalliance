import {
  Accordion,
  Button,
  Grid,
  Group,
  Paper,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";

const SelectionPitFormView = ({
  pitFormData,
  aggregationData,
}: {
  pitFormData: any;
  aggregationData: any;
}) => {
  return (
    <div>
      {pitFormData ? (
        <Accordion
          defaultValue={["strategy"]}
          pt={10}
          multiple
          variant="contained"
        >
          {aggregationData?.Comments?.length !== 0 ? (
            <Accordion.Item value="comments">
              <Accordion.Control>Comments</Accordion.Control>
              <Accordion.Panel>
                <Grid grow>
                  {aggregationData?.Comments.map((comment: any, index: any) => {
                    return (
                      <Grid.Col span={12} key={index + 1}>
                        <Paper shadow="xl" radius="md" p="sm" withBorder>
                          <Text fw={700}>Match #soon - placeholder</Text>
                          <Text fw={400}>"{comment.comment}"</Text>
                          <Button
                            variant="outline"
                            fullWidth
                            mt="md"
                            component="a"
                            target={"_blank"}
                            href={`#`}
                          >
                            View Form
                          </Button>
                        </Paper>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>
          ) : null}
          <Accordion.Item value="strategy">
            <Accordion.Control>Strategy</Accordion.Control>
            <Accordion.Panel>
              <Group p={12}>
                <Textarea
                  placeholder="Description..."
                  label="Overall Strategy"
                  description="What was the team's overall strategy?"
                  autosize
                  minRows={1}
                  value={pitFormData?.overallStrategy}
                  readOnly
                />

                <TextInput
                  label="April Tags"
                  description="Did the robot use April Tags?"
                  value={pitFormData?.aprilTags ? "Yes" : "No"}
                  readOnly
                />

                {pitFormData?.aprilTags && (
                  <Textarea
                    placeholder="Description..."
                    label="April Tags Usage"
                    description="How were April Tags used?"
                    autosize
                    minRows={1}
                    value={pitFormData?.aprilTagsUse}
                    readOnly
                  />
                )}
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="mechanical">
            <Accordion.Control>Mechanical/Electrical</Accordion.Control>
            <Accordion.Panel>
              <Group p={12}>
                <Textarea
                  placeholder="Description..."
                  label="Protected Electronics"
                  description="How were the electronics protected?"
                  autosize
                  minRows={1}
                  value={pitFormData?.protectedElectronics}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Battery Secured"
                  description="How was the battery secured?"
                  autosize
                  minRows={1}
                  value={pitFormData?.batterySecured}
                  readOnly
                />

                <TextInput
                  label="Cameras"
                  description="Did the robot have cameras?"
                  value={pitFormData?.cameras ? "Yes" : "No"}
                  readOnly
                />

                {pitFormData?.cameras && (
                  <Textarea
                    placeholder="Description..."
                    label="Camera Usage"
                    description="How were the cameras used?"
                    autosize
                    minRows={1}
                    value={pitFormData?.cameraUsage}
                    readOnly
                  />
                )}

                <Textarea
                  placeholder="Description..."
                  label="Drivetrain Type"
                  description="What type of drivetrain was used?"
                  autosize
                  minRows={1}
                  value={pitFormData?.drivetrainType}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Drivetrain Brand"
                  description="What brand was the drivetrain?"
                  autosize
                  minRows={1}
                  value={pitFormData?.drivetrainBrand}
                  readOnly
                />

                <TextInput
                  label="Backup Swerve"
                  description="Did the robot have backup swerve modules?"
                  value={pitFormData?.backupSwerve ? "Yes" : "No"}
                  readOnly
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="driveteam">
            <Accordion.Control>Driveteam/Competition</Accordion.Control>
            <Accordion.Panel>
              <Group p={12}>
                <Textarea
                  placeholder="Description..."
                  label="Complimentary Robot"
                  description="What type of robot compliments them?"
                  autosize
                  minRows={1}
                  value={pitFormData?.complimentaryRobot}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Robot Changes"
                  description="Changes since last competition/year?"
                  autosize
                  minRows={1}
                  value={pitFormData?.robotChanges}
                  readOnly
                />

                <TextInput
                  label="Score Shoot"
                  description="Did the robot score by shooting?"
                  value={pitFormData?.scoreShoot ? "Yes" : "No"}
                  readOnly
                />

                <TextInput
                  label="Score Pickup"
                  description="Did the robot score by picking up?"
                  value={pitFormData?.scorePickup ? "Yes" : "No"}
                  readOnly
                />

                <TextInput
                  label="Score Other"
                  description="Did the robot score by other means?"
                  value={pitFormData?.scoreOther ? "Yes" : "No"}
                  readOnly
                />

                {pitFormData?.scoreOther && (
                  <Textarea
                    placeholder="Description..."
                    label="Score Other Explain"
                    description="Explain 'other'."
                    autosize
                    minRows={1}
                    value={pitFormData?.scoreOtherExplain}
                    readOnly
                  />
                )}

                <TextInput
                  label="Pickup Ground"
                  description="Did the robot pickup from the ground?"
                  value={pitFormData?.pickupGround ? "Yes" : "No"}
                  readOnly
                />

                <TextInput
                  label="Pickup Source"
                  description="Did the robot pickup from a source?"
                  value={pitFormData?.pickupSource ? "Yes" : "No"}
                  readOnly
                />

                <TextInput
                  label="Pickup Other"
                  description="Did the robot pickup by other means?"
                  value={pitFormData?.pickupOther ? "Yes" : "No"}
                  readOnly
                />

                {pitFormData?.pickupOther && (
                  <Textarea
                    placeholder="Description..."
                    label="Pickup Other Explain"
                    description="Explain 'other'."
                    autosize
                    minRows={1}
                    value={pitFormData?.pickupOtherExplain}
                    readOnly
                  />
                )}

                <TextInput
                  label="Auto"
                  description="Did the robot have an auto?"
                  value={pitFormData?.auto ? "Yes" : "No"}
                  readOnly
                />

                {pitFormData?.auto && (
                  <TextInput
                    placeholder="Description..."
                    label="Auto Count"
                    description="How many?"
                    value={pitFormData?.autoCount}
                    readOnly
                  />
                )}

                <Textarea
                  placeholder="Description..."
                  label="Ideal Auto"
                  description="Ideal auto?"
                  autosize
                  minRows={1}
                  value={pitFormData?.idealAuto}
                  readOnly
                />

                <Group>
                  <TextInput
                    label="Can Score Speaker"
                    description="Can the robot score with the speaker?"
                    value={pitFormData?.canScoreSpeaker ? "Yes" : "No"}
                    readOnly
                  />

                  <TextInput
                    label="Can Score Amp"
                    description="Can the robot score with the amp?"
                    value={pitFormData?.canScoreAmp ? "Yes" : "No"}
                    readOnly
                  />

                  <TextInput
                    label="Can Score Trap"
                    description="Can the robot score with the trap?"
                    value={pitFormData?.canScoreTrap ? "Yes" : "No"}
                    readOnly
                  />
                </Group>

                <TextInput
                  label="Fit Under Stage"
                  description="Can the robot fit under the stage?"
                  value={pitFormData?.fitUnderStage ? "Yes" : "No"}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Climb Info"
                  description="Can you climb? How many robots at once?"
                  autosize
                  minRows={1}
                  value={pitFormData?.climbInfo}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Human Player Info"
                  description="Human Player Consistency on Spotlight?"
                  autosize
                  minRows={1}
                  value={pitFormData?.humanPlayerInfo}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Robot Issues"
                  description="Issues with your robot?"
                  autosize
                  minRows={1}
                  value={pitFormData?.robotIssues}
                  readOnly
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="general">
            <Accordion.Control>General</Accordion.Control>
            <Accordion.Panel>
              <Group p={12}>
                <TextInput
                  label="Preferred Driver Station"
                  description="Preferred Driver Station?"
                  value={pitFormData?.preferredDriverStation}
                  readOnly
                />

                <TextInput
                  label="Preferred Human Player Placement"
                  description="Preferred Human Player Placement?"
                  value={pitFormData?.preferedHumanPlayerPlacement}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Strongest Value"
                  description="Strongest value on robot?"
                  autosize
                  minRows={1}
                  value={pitFormData?.strongestValue}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Weakest Value"
                  description="Weakest value on robot?"
                  autosize
                  minRows={1}
                  value={pitFormData?.weakestValue}
                  readOnly
                />

                <Textarea
                  placeholder="Description..."
                  label="Extra Comments"
                  description="Any extra comments?"
                  autosize
                  minRows={1}
                  value={pitFormData?.extraComments}
                  readOnly
                />

                <TextInput
                  label="Direct Contact"
                  description="Preferred direct contact?"
                  value={pitFormData?.directContact}
                  readOnly
                />
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ) : (
        <Accordion defaultValue={"pitscouting"}>
          <Accordion.Item value="pitscouting">
            <Accordion.Control>Pit Scouting</Accordion.Control>
            <Accordion.Panel>
              <Group p={12}>
                <Text className="text-center font-bold" size="lg">
                  No Pit Scouting data found!
                </Text>
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </div>
  );
};

export default SelectionPitFormView;
