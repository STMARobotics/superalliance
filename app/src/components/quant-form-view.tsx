import { TextInput, Group, Badge } from "@mantine/core";

const QuantFormView = ({ formData }: { formData: any }) => {
  return (
    <>
      <div className="pb-4 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] flex flex-row items-center justify-center">
        Quantitative Stand Form
      </div>
  <Group className="pb-4 flex justify-center">
        <Badge color="red" variant="outline">
          Event: {formData?.event}
        </Badge>
        <Badge color="blue" variant="outline">
          Team: {formData?.teamNumber}
        </Badge>
        <Badge color="green" variant="outline">
          Match: {formData?.matchNumber}
        </Badge>
      </Group>
      <TextInput
        value={formData?.usersName || ""}
        readOnly
        label="User's Name"
        className="pb-4"
      />
      <TextInput
        value={formData?.autoFuel}
        readOnly
        label="Auto Fuel Scored"
        className="pb-4"
      />
      <TextInput
        value={formData?.teleFuel}
        readOnly
        label="Teleop Fuel Scored"
        className="pb-4"
      />
      <TextInput
        value={formData?.shotsMissed}
        readOnly
        label="Shots Missed"
        className="pb-4"
      />
    </>
  );
};

export default QuantFormView;
