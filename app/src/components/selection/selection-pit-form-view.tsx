import { Accordion, Group, TextInput, Textarea } from "@mantine/core";

const SelectionPitFormView = ({
  pitFormData,
}: {
  pitFormData: any;
  aggregationData: any;
}) => {
  return (
    <div>
      {pitFormData ? (
        <Accordion
                defaultValue={["mechanical"]}
                pt={10}
                multiple
                variant="contained"
              >
                <Accordion.Item value="mechanical">
                  <Accordion.Control>Mechanical/Electrical</Accordion.Control>
                  <Accordion.Panel>
                    <Group p={12}>
                      <TextInput
                        label="Protected Electronics"
                        description="Were the electronics protected?"
                        value={pitFormData?.protectedElectronics ? "Yes" : "No"}
                        readOnly
                      />

                      <Textarea
                        placeholder="Description..."
                        label="Battery Secured"
                        description="How was the battery secured?"
                        autosize
                        minRows={1}
                        value={pitFormData?.batterySecured ? "Yes" : "No"}
                        readOnly
                      />

                      <Textarea
                        placeholder="Description..."
                        label="High Center Of Mass"
                        description="Does the robot have a high center of mass?"
                        autosize
                        minRows={1}
                        value={pitFormData?.highCenterOfMass ? "Yes" : "No"}
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
                        value={pitFormData?.coralStuck ? "Yes" : "No"}
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

                      <Textarea
                        placeholder="1-10"
                        label="Pit Rating"
                        description="How good the pit was to scout"
                        autosize
                        minRows={1}
                        value={pitFormData?.pitRating}
                        readOnly 
                      />
                      <Textarea
                        placeholder="1-5"
                        label="Robot Rating"
                        description="How good the robot was"
                        autosize
                        minRows={1}
                        value={pitFormData?.robotRating}
                        readOnly
                      />
                    </Group>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
      ) : null}
    </div>
  );
};

export default SelectionPitFormView;
