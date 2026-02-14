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
  Select,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { appConfig } from "@/config/app";

export default function PitForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const { events, appSettings, eventTeams } = useSuperAlliance();
  const [ eventData, setEventData ] = useState([]);
  const [ eventTeamsData, setEventTeamsData ] = useState([]);
  const { api } = useSuperAllianceApi();

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

  useEffect(() => {
    if (!eventTeams) return;
    if (eventTeams?.length > 0) {
      setEventTeamsData(
        eventTeams.map((team: any) => team.teamNumber.toString())
      );
    }
  }, [eventTeams]);

  const pitForm = useForm({
    initialValues: {
      event: null,
      teamNumber: null,
      notDo: "",
      protectedElectronics: false,
      batterySecured: false,
      highCenterOfMass: false,
      coralStuck: false,
      pickupGround: false,
      pickupSource: false,
      pickupOther: false,
      pickupOtherExplain: "",
      idealAuto: "",
      strongestValue: "",
      weakestValue: "",
      extraComments: "",    },

    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
    },
  });

  const submitForm = (values: any) => {
    (async function () {
      let formExists = true;
      try {
        await api.get(
          `${import.meta.env.VITE_API_URL}/api/form/pit/${values?.event}/${values?.teamNumber}`)
      } catch (err: any) {
        if (err.response?.status === 404) {
          formExists = false;
        }
      }
      if (formExists) {
        return toast.error("A pit form for this team has already been submitted!");
      }

      if (!file) return toast.error("Please upload an image!");

      // Get signed S3 URL from backend
      const { data: s3Data } = await api.post(
        `${import.meta.env.VITE_API_URL}/api/form/pit/image-upload`,
        {
          "year": appConfig?.year,
          "eventCode": values?.event,
          "teamNumber": values?.teamNumber,
          "fileType": file.type,
        }
      );

      // Upload the image to S3
      await axios.put(s3Data.url, file, {
        headers: {
          "Content-Type": file.type,
          "Cache-Control": "public, max-age=31536000, immutable"
        },
      });

      const struct = {
        usersName: user?.fullName,
        robotImage: `${s3Data.fileUrl}`,
        ...values,
      };
      await api
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

        <Select
          data={eventTeamsData.map((team: any) => {
            return {
              label: team,
              value: team,
            };
          })}
          label="Team number"
          placeholder="Team number"
          className="pb-4"
          description={
            "The number of the team for the robot you are scouting."
          }
          required
          {...pitForm.getInputProps("teamNumber")}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
          Strategy
        </div>

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

        <Checkbox
          className="pb-4"
          size="sm"
          label="Are your electronics protected?"
          {...pitForm.getInputProps("protectedElectronics", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Is your battery secured?"
          {...pitForm.getInputProps("batterySecured", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="sm"
          label="Does your robot have a high center of mass?"
          {...pitForm.getInputProps("highCenterOfMass", { type: "checkbox" })}
        />

        <div className="pb-6 text-center text-3xl font-bold leading-tight tracking-tighter text-gray-300 md:text-3xl lg:leading-[1.1]">
          Driveteam/Competition
        </div>

        <Checkbox
          className="pb-4"
          size="sm"
          label="Can coral get stuck on your robot?"
          {...pitForm.getInputProps("CoralStuck", { type: "checkbox" })}
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
          description="How was pit scouting them?"
          className="pb-4"
          maxLength={2}
          autosize
          {...pitForm.getInputProps("pitRating")}
        />

        <Textarea
          label="Robot Rating"
          description="How would you rate their robot overall?"
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
