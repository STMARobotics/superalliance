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
  RadioGroup
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useUser } from "@clerk/clerk-react";
import { IconArrowUp } from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator.tsx";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider.tsx";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Radio } from "@mantine/core";
import { useSuperAllianceApi } from "@/lib/superallianceapi.ts";

interface StandFormValues {
  event: null | number;
  teamNumber: null | string | number;
  matchNumber: null | number;
  leave: boolean;
  autoCoralL1: null | number;
  autoCoralL2: null | number;
  autoCoralL3: null | number;
  autoCoralL4: null | number;
  autoAlgaeProcessor: null | number;
  autoAlgaeNet: null | number;
  teleopCoralL1: null | number;
  teleopCoralL2: null | number;
  teleopCoralL3: null | number;
  teleopCoralL4: null | number;
  teleopAlgaeProcessor: null | number;
  teleopAlgaeNet: null | number;
  park: boolean;
  shallowClimb: boolean;
  deepClimb: boolean;
  criticals: any[];
  comments: string;
  strategy: string;
  rpEarned: null | number;
  defendedAgainst: boolean;
  defense: boolean;
  win: boolean;
}

export default function StandFormChad() {
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const navigate = useNavigate();
  const { events, appSettings } = useSuperAlliance();
  const [eventData, setEventData] = useState([]);
  const [matchTeams, setMatchTeams] = useState<any>();
  const [submitPress, setSubmitPress] = useState(false);
  const { getTeamsFromMatch, api } = useSuperAllianceApi();

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
  }, [appSettings]);

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
      matchNumber: null,
      leave: false,
      autoCoralL1: 0,
      autoCoralL2: 0,
      autoCoralL3: 0,
      autoCoralL4: 0,
      autoAlgaeProcessor: 0,
      autoAlgaeNet: 0,
      teleopCoralL1: 0,
      teleopCoralL2: 0,
      teleopCoralL3: 0,
      teleopCoralL4: 0,
      teleopAlgaeProcessor: 0,
      teleopAlgaeNet: 0,
      park: false,
      shallowClimb: false,
      deepClimb: false,
      criticals: [],
      comments: "",
      strategy: "",      
      rpEarned: 0,
      defendedAgainst: false,
      defense: false,
      win: false,
    },
    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
      matchNumber: isNotEmpty("This cannot be empty"),
      autoCoralL1: isNotEmpty("This cannot be empty"),
      autoCoralL2: isNotEmpty("This cannot be empty"),
      autoCoralL3: isNotEmpty("This cannot be empty"),
      autoCoralL4: isNotEmpty("This cannot be empty"),
      autoAlgaeProcessor: isNotEmpty("This cannot be empty"),
      autoAlgaeNet: isNotEmpty("This cannot be empty"),
      teleopCoralL1: isNotEmpty("This cannot be empty"),
      teleopCoralL2: isNotEmpty("This cannot be empty"),
      teleopCoralL3: isNotEmpty("This cannot be empty"),
      teleopCoralL4: isNotEmpty("This cannot be empty"),
      teleopAlgaeProcessor: isNotEmpty("This cannot be empty"),
      teleopAlgaeNet: isNotEmpty("This cannot be empty"),
      rpEarned: isNotEmpty("This cannot be empty"),
    },
  });


  const submitForm = async (values: any) => {
    setSubmitPress(true);
    const struct = {
      usersName: user?.fullName,
      ...values,
    };
    await api
      .post(`${import.meta.env.VITE_API_URL}/api/form/stand/submit`, struct)
      .then(function () {
        toast.success("The form has been submitted successfully!");
        navigate("/");
      })
      .catch(function () {
        toast.error("The form failed to submit. Please contact an admin!");
        setSubmitPress(false);
      });
  };

  const configureMatchTeams = () => {
    (async function () {
      if (!appSettings) return;
      if (!form.values?.matchNumber) return setMatchTeams([]);
      if (
        appSettings?.event == "testing" ||
        appSettings?.event == "week0" ||
        appSettings?.event == "gnrprac" ||
        appSettings?.event == "worldsprac"
      )
        return;
      try {
        const data = await getTeamsFromMatch(
          appSettings?.event,
          form.values?.matchNumber
        );
        const teamsArray: any[] = [];
        data.red.map((team: any, index: any) => {
          const struct = {
            label: `Red ${index + 1} - ${team}`,
            value: team,
          };
          teamsArray.push(struct);
        });
        data.blue.map((team: any, index: any) => {
          const struct = {
            label: `Blue ${index + 1} - ${team}`,
            value: team,
          };
          teamsArray.push(struct);
        });
        return setMatchTeams(teamsArray);
      } catch (err) {
        toast.error("Match not found, is this a valid match number?");
        return setMatchTeams([]);
      }
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
        onSubmit={form.onSubmit((values) => submitForm(values))}
        className="w-full max-w-md p-10"
      >

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
          label="Match Number"
          description={"The number of the match you are scouting for."}
          placeholder="0"
          className="pb-4 w-full"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          inputMode="numeric"
          {...form.getInputProps("matchNumber")}
        />

        {appSettings?.event !== "none" &&
          appSettings?.event !== "gnrprac" &&
          appSettings?.event !== "worldsprac" &&
          appSettings?.event !== "gcrprac" && (
            <div className="pb-4">
              <Button
                fullWidth
                h={"3rem"}
                className="bg-white text-black"
                onClick={configureMatchTeams}
              >
                Get Teams
              </Button>
            </div>
          )}

        {appSettings?.event !== "none" &&
        appSettings?.event !== "gnrprac" &&
        appSettings?.event !== "worldsprac" &&
        appSettings?.event !== "gcrprac" &&
        matchTeams?.length > 0 ? (
          <Select
            data={matchTeams}
            placeholder="Pick one"
            label="Select Team"
            className="pb-4"
            description={
              "The number of the team for the robot you are scouting."
            }
            required
            {...form.getInputProps("teamNumber")}
          />
        ) : (
          <>
            {(matchTeams && appSettings?.event !== "none") ||
            appSettings?.event == "none" ||
            appSettings?.event == "gnrprac" ||
            appSettings?.event == "worldsprac" ||
            appSettings?.event == "gcrprac" ? (
              <NumberInput
                label="Team Number"
                description={
                  "The number of the team for the robot you are scouting."
                }
                placeholder="1234"
                className="pb-4"
                allowDecimal={false}
                allowNegative={false}
                hideControls
                maxLength={5}
                inputMode="numeric"
                {...form.getInputProps("teamNumber")}
              />
            ) : (
              <Select
                placeholder="Pick one"
                label="Select Team"
                disabled
                className="pb-4"
                description={
                  "Please select a match number and press 'Get Teams'."
                }
                required
              />
            )}
          </>
        )}

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Autonomous
        </div>

        <div className="flex flex-row justify-between items-center w-full gap-5">
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              if (
                form.values.autoCoralL1 !== null &&
                form.values.autoCoralL1 > 0
              ) {
                form.setFieldValue(
                  "autoCoralL1",
                  Number(form.values.autoCoralL1 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral Level 1"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoCoralL1")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoCoralL1",
                Number(form.values.autoCoralL1! + 1)
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
                form.values.autoCoralL2 !== null &&
                form.values.autoCoralL2 > 0
              ) {
                form.setFieldValue(
                  "autoCoralL2",
                  Number(form.values.autoCoralL2 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral Level 2"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoCoralL2")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoCoralL2",
                Number(form.values.autoCoralL2! + 1)
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
                form.values.autoCoralL3 !== null &&
                form.values.autoCoralL3 > 0
              ) {
                form.setFieldValue(
                  "autoCoralL3",
                  Number(form.values.autoCoralL3 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral Level 3"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoCoralL3")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoCoralL3",
                Number(form.values.autoCoralL3! + 1)
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
                form.values.autoCoralL4 !== null &&
                form.values.autoCoralL4 > 0
              ) {
                form.setFieldValue(
                  "autoCoralL4",
                  Number(form.values.autoCoralL4 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral Level 4"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoCoralL4")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoCoralL4",
                Number(form.values.autoCoralL4! + 1)
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
                form.values.autoAlgaeProcessor !== null &&
                form.values.autoAlgaeProcessor > 0
              ) {
                form.setFieldValue(
                  "autoAlgaeProcessor",
                  Number(form.values.autoAlgaeProcessor - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Algae Processor"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoAlgaeProcessor")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoAlgaeProcessor",
                Number(form.values.autoAlgaeProcessor! + 1)
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
                form.values.autoAlgaeNet !== null &&
                form.values.autoAlgaeNet > 0
              ) {
                form.setFieldValue(
                  "autoAlgaeNet",
                  Number(form.values.autoAlgaeNet - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Algae Barge"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoAlgaeNet")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoAlgaeNet",
                Number(form.values.autoAlgaeNet! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot LEAVE?"
          description="The robot's bumpers fully left the starting area at any point during the autonomous period."
          {...form.getInputProps("leave", { type: "checkbox" })}
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
                form.values.teleopCoralL1 !== null &&
                form.values.teleopCoralL1 > 0
              ) {
                form.setFieldValue(
                  "teleopCoralL1",
                  Number(form.values.teleopCoralL1 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral L1"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopCoralL1")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopCoralL1",
                Number(form.values.teleopCoralL1! + 1)
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
                form.values.teleopCoralL2 !== null &&
                form.values.teleopCoralL2 > 0
              ) {
                form.setFieldValue(
                  "teleopCoralL2",
                  Number(form.values.teleopCoralL2 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral L2"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopCoralL2")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopCoralL2",
                Number(form.values.teleopCoralL2! + 1)
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
                form.values.teleopCoralL3 !== null &&
                form.values.teleopCoralL3 > 0
              ) {
                form.setFieldValue(
                  "teleopCoralL3",
                  Number(form.values.teleopCoralL3 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral L3"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopCoralL3")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopCoralL3",
                Number(form.values.teleopCoralL3! + 1)
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
                form.values.teleopCoralL4 !== null &&
                form.values.teleopCoralL4 > 0
              ) {
                form.setFieldValue(
                  "teleopCoralL4",
                  Number(form.values.teleopCoralL4 - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Coral L4"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopCoralL4")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopCoralL4",
                Number(form.values.teleopCoralL4! + 1)
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
                form.values.teleopAlgaeProcessor !== null &&
                form.values.teleopAlgaeProcessor > 0
              ) {
                form.setFieldValue(
                  "teleopAlgaeProcessor",
                  Number(form.values.teleopAlgaeProcessor - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Algae Processor"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopAlgaeProcessor")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopAlgaeProcessor",
                Number(form.values.teleopAlgaeProcessor! + 1)
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
                form.values.teleopAlgaeNet !== null &&
                form.values.teleopAlgaeNet > 0
              ) {
                form.setFieldValue(
                  "teleopAlgaeNet",
                  Number(form.values.teleopAlgaeNet - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Algae Barge"
            description="The ROBOT (not the human player) shot algae into the Barge"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleopAlgaeNet")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleopAlgaeNet",
                Number(form.values.teleopAlgaeNet! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>

        </div>

      <RadioGroup
        label="Endgame"
        size="md"
        required
        >
      <Radio
        value="park"
        checked={!form.values.park}
        onChange={(event) =>
          form.setFieldValue("park", event.currentTarget.checked)
        }
        label="Did the Robot PARK?"
        description="Any part of the robots bumpers were in the PARK zone"
      />
      <Radio
        value="shallowClimb"
        checked={!form.values.shallowClimb}
        onChange={(event) =>
          form.setFieldValue("shallowClimb", event.currentTarget.checked)
        }
        label="Did the robot shallow climb?"
        description="The Robot Successfully climbed the higher cage"
      />
      <Radio
        value="deepClimb"
        checked={!form.values.deepClimb}
        onChange={(event) =>
          form.setFieldValue("deepClimb", event.currentTarget.checked)
        }
        label="Did the robot deep climb?"
        description="The Robot Successfully climbed the lower cage"
      />
      </RadioGroup>

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Post-Match
        </div>

        <MultiSelect
          data={criticals}
          label="Criticals"
          placeholder="Choose criticals."
          searchable
          nothingFoundMessage="No criticals found"
          className="pb-4"
          {...form.getInputProps("criticals")}
        />

        <Textarea
          label="Overall strategy"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          {...form.getInputProps("strategy")}
        />

        <Textarea
          label="Extra comments"
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
            inputMode="numeric"
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
          label="Was your team's bot defended against?"
          {...form.getInputProps("defendedAgainst", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did your team defend?"
          {...form.getInputProps("defense", { type: "checkbox" })}
        />

        <Separator />

        <Checkbox
          className="py-4"
          size="lg"
          label="Did the team win?"
          {...form.getInputProps("win", { type: "checkbox" })}
        />

        <Group justify="center" mt="md">
          <Button
            type="submit"
            fullWidth
            h={"3rem"}
            className="bg-white text-black"
            loading={submitPress}
          >
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}
