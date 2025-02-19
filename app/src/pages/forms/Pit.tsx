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

  const [file, setFile] = useState<File | null>(null);

  const { events, appSettings } = useSuperAlliance();
  const [eventData, setEventData] = useState([]);

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

  useEffect(() => {
    if (!appSettings) return;
    if (appSettings?.event !== "none") {
      pitForm.setFieldValue("event", appSettings?.event);
    }
  }, [appSettings]);

  const pitForm = useForm({
    initialValues: {
      event: null,
      teamNumber: null,
      aprilTags: false,
      aprilTagsUse: "",
      notDo: "",
      protectedElectronics: "",
      batterySecured: "",
      highCenterOfMass: "",
      complimentaryRobot: "",
      robotChanges: "",
      coralStuck: "",
      coachExperience: "",
      operatorExperience: "",
      driverExperience: "",
      pickupGround: false,
      pickupSource: false,
      pickupOther: false,
      pickupOtherExplain: "",
      idealAuto: "",
      preferredDriverStation: "",
      preferedHumanPlayerPlacement: "",
      strongestValue: "",
      weakestValue: "",
      extraComments: "",
      pitRating: "",
      robotRating: "",
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
      if (pitForm.data !== "")
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
    <div className="flex w-full flex-col items-center justify-center pt-3">
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

        <TextInput
          label="User's Name"
          value={user?.fullName ? user?.fullName : ""}
          onChange={() => null}
          className="pb-4"
        />

        {appSettings?.event == "none" ? (
          <Select
            label="Select event"
            placeholder="Event"
            className="pb-4"
            data={eventData}
            {...pitForm.getInputProps("event")}
          />
        ) : (
          <Select
            label="Select event"
            description="This event has been locked in by an Administrator!"
            disabled
            placeholder="Event"
            className="pb-4"
            data={eventData}
            {...pitForm.getInputProps("event")}
          />
        )}

        <NumberInput
          label="Team number"
          placeholder="7028"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          maxLength={4}
          {...pitForm.getInputProps("teamNumber")}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
          Strategy
        </div>

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

        <Textarea
          label="What can your robot not do?"
          placeholder="Type some text here."
          className="pb-4"
          autosize
          {...pitForm.getInputProps("notDo")}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
          Mechanical/Electrical
        </div>

        <TextInput
          label="Protected electronics? (look & ask)"
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

        <TextInput
          label="Does your robot have a high center of mass?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("highCenterOfMass")}
          maxLength={750}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
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

        <Textarea
          label="Can coral get stuck on your robot?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("coralStuck")}
        />

        <Textarea
          label="How many competitions has your drive coach been to?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("coachExperience")}
        />

        <Textarea
          label="How many competitions has your operator been to?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("operatorExperience")}
        />

        <Textarea
          label="How many competitions has your driver been to?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("driverExperience")}
        />

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

        <Textarea
          label="Ideal auto?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...pitForm.getInputProps("idealAuto")}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
          General
        </div>

        <TextInput
          label="Prefered driver station?"
          placeholder="Type some text here."
          className="pb-4"
          {...pitForm.getInputProps("preferredDriverStation")}
        />

        <TextInput
          label="Preferred human player placement?"
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

        <Textarea
          label="Pit Rating"
          placeholder="1-10"
          className="pb-4"
          maxLength={2}
          autosize
          {...pitForm.getInputProps("pitRating")}
        />

        <Textarea
          label="Robot Rating"
          placeholder="1-5"
          className="pb-4"
          maxLength={1}
          autosize
          {...pitForm.getInputProps("robotRating")}
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
          <Button
            type="submit"
            fullWidth
            h={"3rem"}
            className="bg-white text-black"
          >
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}
