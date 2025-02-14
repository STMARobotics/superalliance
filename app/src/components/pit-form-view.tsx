import { Accordion, Group, TextInput, Textarea } from "@mantine/core";

const classes = {
  root: `border-radius: var(--mantine-radius-sm); background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));`,
  item: `
  background-color: light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6));
  border: rem(1px) solid transparent;
  position: relative;
  z-index: 0;
  transition: transform 150ms ease;

  &[data-active] {
    transform: scale(1.03);
    z-index: 1;
    background-color: var(--mantine-color-body);
    border-color: light-dark(var(--mantine-color-gray-2), var(--mantine-color-dark-4));
    box-shadow: var(--mantine-shadow-md);
    border-radius: var(--mantine-radius-md);
  }
  `,
  chevron: `
  &[data-rotate] {
    transform: rotate(-90deg);
  }
  `,
};

const PitFormView = ({ pitFormData }: { pitFormData: any }) => {
  return (
    <>
      <Accordion
        defaultValue={["strategy"]}
        pt={10}
        multiple
        variant="contained"
        classNames={classes}
      >
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
                label="Score L1"
                description="Did the robot score by L1?"
                value={pitFormData?.scoreL1 ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score L2"
                description="Did the robot score by L2?"
                value={pitFormData?.scoreL2 ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score L3"
                description="Did the robot score by L3?"
                value={pitFormData?.scoreL3 ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score L4"
                description="Did the robot score by L4?"
                value={pitFormData?.scoreL4 ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score Processor"
                description="Did the robot score via the processor?"
                value={pitFormData?.scoreProcessor ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score Shallow"
                description="Did the robot score by climbing shallow?"
                value={pitFormData?.scoreShallow ? "Yes" : "No"}
                readOnly
              />

              <TextInput
                label="Score Deep"
                description="Did the robot score by climbing deep?"
                value={pitFormData?.scoreDeep ? "Yes" : "No"}
                readOnly
              />

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
            </Group>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default PitFormView;
