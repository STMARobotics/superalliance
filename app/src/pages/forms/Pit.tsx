import { useUser } from "@clerk/clerk-react";
import {
  Affix,
  Button,
  Checkbox,
  TextInput,
  Textarea,
  Transition,
  Text,
  Group,
  FileButton,
  Card,
  Image,
  NumberInput,
  Select,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import FormData from "form-data";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

export default function PitForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const navigate = useNavigate();
  const { events } = useSuperAlliance();
  const [eventData, setEventData] = useState([]);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!events) return;
    setEventData(
      events.map((event: any) => {
        return {
          label: event.short_name,
          value: event.event_code,
        };
      })
    );
  }, [events]);

  const pitForm = useForm({
    initialValues: {
      event: null,
      teamNumber: null,
      overallStrategy: "",
      aprilTags: false,
      aprilTagsUse: "",
      protectedElectronics: "",
      batterySecured: "",
      cameras: false,
      cameraUsage: "",
      drivetrainType: "",
      drivetrainBrand: "",
      backupSwerve: false,
      complimentaryRobot: "",
      robotChanges: "",
      scoreShoot: false,
      scorePickup: false,
      scoreOther: false,
      scoreOtherExplain: "",
      pickupGround: false,
      pickupSource: false,
      pickupOther: false,
      pickupOtherExplain: "",
      auto: false,
      autoCount: "",
      idealAuto: "",
      canScoreSpeaker: false,
      canScoreAmp: false,
      canScoreTrap: false,
      fitUnderStage: false,
      climbInfo: "",
      humanPlayerInfo: "",
      robotIssues: "",
      preferredDriverStation: "",
      preferedHumanPlayerPlacement: "",
      strongestValue: "",
      weakestValue: "",
      extraComments: "",
      directContact: "",
    },

    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
    },
  });

  const submitForm = (values: any) => {
    (async function () {
      const pitForm = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/form/pit/${values?.teamNumber}`
      );
      if (pitForm)
        return toast.error(
          "A pit form for this team has already been submitted!"
        );

      if (!file) return toast.error("Please upload an image!");
      var data = new FormData();
      data.append("image", file);

      var config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api.imgbb.com/1/upload?key=1fa1a436f62b86f55a9ee6cda8cbb393",
        headers: {
          Accept: "application/json",
        },
        data: data,
      };

      const res = await axios(config);

      const struct = {
        usersName: user?.fullName,
        robotImage: res.data.data.url,
        ...values,
      };
      await axios
        .post(`${import.meta.env.VITE_API_URL}/api/form/pit/submit`, struct)
        .then(function () {
          toast.success("The form has been submitted successfully!");
          navigate("/");
        })
        .catch(function () {
          toast.error("The form failed to submit. Please contact an admin!");
        });
    })();
  };
  return (
    <div className="pt-3 flex flex-col w-full justify-center items-center">
      <>
        <Affix position={{ bottom: 20, right: 20 }}>
          <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                size="sm"
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
              >
                <IconArrowUp size={15} />
              </Button>
            )}
          </Transition>
        </Affix>
      </>
      <form
        onSubmit={pitForm.onSubmit((values) => submitForm(values))}
        className="w-full max-w-md p-10"
      >
        <div className="pb-8 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          Pit Scouting Form
        </div>

        <Select
          label="Select Event"
          placeholder="Event"
          className="pb-4"
          data={eventData}
          {...pitForm.getInputProps("event")}
        />

        <NumberInput
          label="Team Number"
          placeholder="7028"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          maxLength={4}
          {...pitForm.getInputProps("teamNumber")}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Strategy
        </div>

        <Textarea
          label="Overall strategy?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("overallStrategy")}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Do you use April Tags?"
          {...pitForm.getInputProps("aprilTags", { type: "checkbox" })}
        />

        {pitForm.values?.aprilTags && (
          <TextInput
            label="How do you use April Tags?"
            placeholder="Type some text here."
            className="pb-4"
            {...pitForm.getInputProps("apriltagsUse")}
          />
        )}

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Mechanical/Electrical
        </div>

        <TextInput
          label="Protected Electronics? (Look & Ask)"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("protectedElectronics")}
        />

        <TextInput
          label="Is your battery secured? How is it secured?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("batterySecured")}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Do you have camera/s?"
          {...pitForm.getInputProps("cameras", { type: "checkbox" })}
        />

        {pitForm.values?.cameras && (
          <TextInput
            label="How do you use the camera/s?"
            placeholder="Type some text here."
            className="pb-4"
            {...pitForm.getInputProps("cameraUsage")}
          />
        )}

        <TextInput
          label="What drivetrain type are you using?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("drivetrainType")}
        />

        <TextInput
          label="What brand drivetrain is it?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("drivetrainBrand")}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Do you have backup swerve modules?"
          {...pitForm.getInputProps("backupSwerve", { type: "checkbox" })}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Driveteam/Competition
        </div>

        <Textarea
          label="What type of robot compliments them?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("complimentaryRobot")}
        />

        <Textarea
          label="Changes since last competition/year?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("robotChanges")}
        />

        <Text size="sm" className="pb-2">
          How do you score game pieces?
        </Text>

        <Checkbox
          className="pb-4"
          size="sm"
          label="Shoot"
          {...pitForm.getInputProps("scoreShoot", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Pickup and Place"
          {...pitForm.getInputProps("scorePickup", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Other?"
          {...pitForm.getInputProps("scoreOther", { type: "checkbox" })}
        />

        {pitForm.values?.scoreOther && (
          <TextInput
            label="Explain 'other'."
            placeholder="Type some text here."
            className="pb-4"
            {...pitForm.getInputProps("scoreOtherExplain")}
          />
        )}

        <Text size="sm" className="pb-2">
          How do you pickup game pieces?
        </Text>

        <Checkbox
          className="pb-4"
          size="sm"
          label="Ground"
          {...pitForm.getInputProps("pickupGround", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Source"
          {...pitForm.getInputProps("pickupSource", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Other?"
          {...pitForm.getInputProps("pickupOther", { type: "checkbox" })}
        />

        {pitForm.values?.pickupOther && (
          <TextInput
            label="Explain 'other'."
            placeholder="Type some text here."
            className="pb-4"
            {...pitForm.getInputProps("pickupOtherExplain")}
          />
        )}

        <Checkbox
          className="pb-4"
          size="md"
          label="Do you have an Auto?"
          {...pitForm.getInputProps("auto", { type: "checkbox" })}
        />

        {pitForm.values?.auto && (
          <TextInput
            label="How many?"
            placeholder="Type some text here."
            className="pb-4"
            {...pitForm.getInputProps("autoCount")}
          />
        )}

        <Textarea
          label="Ideal auto?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("idealAuto")}
        />

        <Text size="sm" className="pb-2">
          Where are you able to score?
        </Text>

        <Group className="pb-4">
          <Checkbox
            size="sm"
            label="Speaker?"
            {...pitForm.getInputProps("canScoreSpeaker", { type: "checkbox" })}
          />

          <Checkbox
            size="sm"
            label="Amp?"
            {...pitForm.getInputProps("canScoreAmp", { type: "checkbox" })}
          />

          <Checkbox
            size="sm"
            label="Trap?"
            {...pitForm.getInputProps("canScoreTrap", { type: "checkbox" })}
          />
        </Group>

        <Checkbox
          className="pb-4"
          size="md"
          label="Can you fit under the stage?"
          {...pitForm.getInputProps("fitUnderStage", { type: "checkbox" })}
        />

        <TextInput
          label="Can you climb? How many robots at once?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("climbInfo")}
        />

        <TextInput
          label="Human Player Consistency on Spotlight?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("humanPlayerInfo")}
        />

        <Textarea
          label="Issues with your robot?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("robotIssues")}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          General
        </div>

        <TextInput
          label="Prefered Driver Station?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("preferredDriverStation")}
        />

        <TextInput
          label="Preferred Human Player Placement?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("preferedHumanPlayerPlacement")}
        />

        <Textarea
          label="Strongest value on robot?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("strongestValue")}
        />

        <Textarea
          label="Weakest value on robot?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("weakestValue")}
        />

        <Textarea
          label="Any extra comments?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("extraComments")}
        />

        <TextInput
          label="Preferred direct contact?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("directContact")}
        />

        <Group justify="center">
          {file ? (
            <Button
              size="md"
              variant="outline"
              onClick={() => {
                setFile(null);
              }}
              color={"red"}
            >
              Reset Image
            </Button>
          ) : (
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Button size="md" variant="outline" {...props}>
                  Upload Image
                </Button>
              )}
            </FileButton>
          )}
        </Group>

        {file && (
          <Card p="md" radius="md" mt={"md"}>
            <Image maw={400} mx="auto" src={URL.createObjectURL(file)} />
          </Card>
        )}

        <Group justify="center" mt="md">
          <Button type="submit" fullWidth h={"3rem"}>
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}
