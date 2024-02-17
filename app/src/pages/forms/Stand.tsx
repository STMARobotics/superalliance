import {
  Button,
  Checkbox,
  Group,
  TextInput,
  NumberInput,
  Textarea,
  MultiSelect,
  Affix,
  Transition,
  Select,
  ActionIcon,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useUser } from "@clerk/clerk-react";
import { IconArrowUp } from "@tabler/icons-react";
import axios from "axios";
import { useWindowScroll } from "@mantine/hooks";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";

interface StandFormValues {
  event: null | number;
  teamNumber: null | number;
  autoAmpsNotes: null | number;
  autoSpeakersNotes: null | number;
  park: boolean;
  teleAmpsNotes: null | number;
  teleSpeakersNotes: null | number;
  teleTrapsNotes: null | number;
  timesAmpedUsed: null | number;
  onstage: boolean;
  onstageSpotlit: boolean;
  harmony: boolean;
  selfSpotlight: boolean;
  criticals: any[];
  comments: string;
  rpEarned: null | number;
  defendedAgainst: boolean;
  defense: boolean;
  stockpile: boolean;
  underStage: boolean;
  win: boolean;
}

export default function StandForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const navigate = useNavigate();
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
      form.setFieldValue("event", appSettings?.event);
    }
  });

  const criticals = [
    "Robot Died",
    "Robot Tipped",
    "Red Card",
    "Mechanism Broke",
    "Bumper Malfunction",
  ];

  const form = useForm<StandFormValues>({
    initialValues: {
      event: null,
      teamNumber: null,
      autoAmpsNotes: 0,
      autoSpeakersNotes: 0,
      park: false,
      teleAmpsNotes: 0,
      teleSpeakersNotes: 0,
      teleTrapsNotes: 0,
      timesAmpedUsed: 0,
      onstage: false,
      onstageSpotlit: false,
      harmony: false,
      selfSpotlight: false,
      criticals: [],
      comments: "",
      rpEarned: 0,
      defendedAgainst: false,
      defense: false,
      stockpile: false,
      underStage: false,
      win: false,
    },
    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
      autoAmpsNotes: isNotEmpty("This cannot be empty"),
      autoSpeakersNotes: isNotEmpty("This cannot be empty"),
      teleAmpsNotes: isNotEmpty("This cannot be empty"),
      teleSpeakersNotes: isNotEmpty("This cannot be empty"),
      teleTrapsNotes: isNotEmpty("This cannot be empty"),
      timesAmpedUsed: isNotEmpty("This cannot be empty"),
      rpEarned: isNotEmpty("This cannot be empty"),
    },
  });

  const submitForm = async (values: any) => {
    const struct = {
      usersName: user?.fullName,
      ...values,
    };
    await axios
      .post(`${import.meta.env.VITE_API_URL}/api/form/stand/submit`, struct)
      .then(function () {
        toast.success("The form has been submitted successfully!");
        navigate("/");
      })
      .catch(function () {
        toast.error("The form failed to submit. Please contact an admin!");
      });
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
        onSubmit={form.onSubmit((values) => submitForm(values))}
        className="w-full max-w-md p-10"
      >
        <div className="pb-8 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          Stand Scouting Form
        </div>

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Pre-Game
        </div>

        <TextInput
          label="User's Name"
          value={user?.fullName ? user?.fullName : ""}
          onChange={() => null}
          className="pb-4"
        />

        {appSettings?.event == "none" ? (
          <Select
            label="Select Event"
            placeholder="Event"
            className="pb-4"
            data={eventData}
            {...form.getInputProps("event")}
          />
        ) : (
          <Select
            label="Select Event"
            description="This event has been locked in by an Administrator!"
            disabled
            placeholder="Event"
            className="pb-4"
            data={eventData}
            {...form.getInputProps("event")}
          />
        )}

        <NumberInput
          label="Team Number"
          placeholder="7028"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          maxLength={4}
          {...form.getInputProps("teamNumber")}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Autonomous
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.autoAmpsNotes !== null &&
                form.values.autoAmpsNotes > 0
              ) {
                form.setFieldValue(
                  "autoAmpsNotes",
                  Number(form.values.autoAmpsNotes - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Notes Scored in Amps"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("autoAmpsNotes")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoAmpsNotes",
                Number(form.values.autoAmpsNotes! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.autoSpeakersNotes !== null &&
                form.values.autoSpeakersNotes > 0
              ) {
                form.setFieldValue(
                  "autoSpeakersNotes",
                  Number(form.values.autoSpeakersNotes - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Notes Scored in Speakers"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("autoSpeakersNotes")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoSpeakersNotes",
                Number(form.values.autoSpeakersNotes! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot park?"
          {...form.getInputProps("park", { type: "checkbox" })}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Teleop
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.teleAmpsNotes !== null &&
                form.values.teleAmpsNotes > 0
              ) {
                form.setFieldValue(
                  "teleAmpsNotes",
                  Number(form.values.teleAmpsNotes - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Notes Scored in Amps"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("teleAmpsNotes")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleAmpsNotes",
                Number(form.values.teleAmpsNotes! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.teleSpeakersNotes !== null &&
                form.values.teleSpeakersNotes > 0
              ) {
                form.setFieldValue(
                  "teleSpeakersNotes",
                  Number(form.values.teleSpeakersNotes! - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Notes Scored in Speakers"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("teleSpeakersNotes")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleSpeakersNotes",
                Number(form.values.teleSpeakersNotes! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.teleTrapsNotes !== null &&
                form.values.teleTrapsNotes > 0
              ) {
                form.setFieldValue(
                  "teleTrapsNotes",
                  Number(form.values.teleTrapsNotes! - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Notes Scored in Traps"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("teleTrapsNotes")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleTrapsNotes",
                Number(form.values.teleTrapsNotes! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.timesAmpedUsed !== null &&
                form.values.timesAmpedUsed > 0
              ) {
                form.setFieldValue(
                  "timesAmpedUsed",
                  Number(form.values.timesAmpedUsed! - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="How many times were the notes amped?"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("timesAmpedUsed")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "timesAmpedUsed",
                Number(form.values.timesAmpedUsed! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot go onstage?"
          {...form.getInputProps("onstage", { type: "checkbox" })}
        />

        {form.values?.onstage && (
          <Checkbox
            className="pb-4 ml-7"
            size="md"
            label="Was it spotlit?"
            {...form.getInputProps("onstageSpotlit", { type: "checkbox" })}
          />
        )}

        <Checkbox
          className="pb-4"
          size="md"
          label="Was harmony achieved?"
          {...form.getInputProps("harmony", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Was your teams player able to spotlight?"
          {...form.getInputProps("selfSpotlight", { type: "checkbox" })}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Post-Match
        </div>

        <MultiSelect
          data={criticals}
          label="Criticals"
          placeholder="Choose Criticals."
          searchable
          nothingFoundMessage="No criticals found"
          className="pb-4"
          {...form.getInputProps("criticals")}
        />

        <Textarea
          label="Comments?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...form.getInputProps("comments")}
        />

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (form.values.rpEarned !== null && form.values.rpEarned > 0) {
                form.setFieldValue(
                  "rpEarned",
                  Number(form.values.rpEarned! - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="How many ranking points were earned?"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            {...form.getInputProps("rpEarned")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue("rpEarned", Number(form.values.rpEarned! + 1));
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Was the your team's bot defended against?"
          {...form.getInputProps("defendedAgainst", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did your team defend?"
          {...form.getInputProps("defense", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did your team stockpile notes?"
          {...form.getInputProps("stockpile", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Could your robot go under the stage?"
          {...form.getInputProps("underStage", { type: "checkbox" })}
        />

        <Separator />

        <Checkbox
          className="py-4"
          size="lg"
          label="Did the team win?"
          {...form.getInputProps("win", { type: "checkbox" })}
        />

        <Group justify="center" mt="md">
          <Button type="submit" fullWidth h={"3rem"} color="white" c="black">
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}
