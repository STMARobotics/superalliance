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

            </Group>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="driveteam">
          <Accordion.Control>Driveteam/Competition</Accordion.Control>
          <Accordion.Panel>
            <Group p={12}>

              <TextInput
                label="Coral Stuck"
                description="Can coral get stuck on your robot?"
                value={pitFormData?.coralStuck}
                readOnly
              />
              
              <TextInput
                label="Coach Experience"
                description="How many competitions has your drive coach been to?"
                value={pitFormData?.coachExperience}
                readOnly
              />
              
              <TextInput
                label="Operator Experience"
                description="How many competitions has your operator been to?"
                value={pitFormData?.operatorExperience}
                readOnly
              />
              
              <TextInput
                label="Driver Experience"
                description="How many competitions has your driver been to?"
                value={pitFormData?.driverExperience}
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

              <Textarea
                placeholder="Description..."
                label="Ideal Auto"
                description="Ideal auto?"
                autosize
                minRows={1}
                value={pitFormData?.idealAuto}
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
