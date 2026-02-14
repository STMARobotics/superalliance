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
  auto: boolean;
  autoClimb: boolean;
  autoFuel: null | number;
  teleFuel: null | number;
  shotsMissed: null | number;
  bump: boolean;
  trench: boolean;
  didClimb: boolean;
  climbPosition: null | string;
  climbLevel: null | string;
  backClimb: boolean;
  leftClimbLevelOne: boolean;
  centerClimbLevelOne: boolean;
  rightClimbLevelOne: boolean;
  leftClimbLevelTwo: boolean;
  centerClimbLevelTwo: boolean;
  rightClimbLevelTwo: boolean;
  leftClimbLevelThree: boolean;
  centerClimbLevelThree: boolean;
  rightClimbLevelThree: boolean;
  criticals: any[];
  comments: string;
  strategy: string;
  rpEarned: null | number;
  defendedAgainst: boolean;
  defense: boolean;
  shuttle: boolean;
  moveWhileShoot: boolean;
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
      auto: false,
      autoClimb: false,
      autoFuel: 0,
      teleFuel: 0,
      shotsMissed: 0,
      bump: false,
      trench: false,
      didClimb: false,
      climbPosition: "",
      climbLevel: "",
      backClimb: false,
      leftClimbLevelOne: false,
      centerClimbLevelOne: false,
      rightClimbLevelOne: false,
      leftClimbLevelTwo: false,
      centerClimbLevelTwo: false,
      rightClimbLevelTwo: false,
      leftClimbLevelThree: false,
      centerClimbLevelThree: false,
      rightClimbLevelThree: false,
      criticals: [],
      comments: "",
      strategy: "",
      rpEarned: 0,
      defendedAgainst: false,
      defense: false,
      shuttle: false,
      moveWhileShoot: false,
      win: false,
    },
    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
      matchNumber: isNotEmpty("This cannot be empty"),
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
                form.values.autoFuel !== null &&
                form.values.autoFuel > 0
              ) {
                form.setFieldValue(
                  "autoFuel",
                  Number(form.values.autoFuel - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Auto Fuel"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("autoFuel")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "autoFuel",
                Number(form.values.autoFuel! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>



        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot climb during auto?"
          description="The robot successfully climbed during the autonomous period."
          {...form.getInputProps("autoClimb", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot move during auto?"
          {...form.getInputProps("auto", { type: "checkbox" })}
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
                form.values.teleFuel !== null &&
                form.values.teleFuel > 0
              ) {
                form.setFieldValue(
                  "teleFuel",
                  Number(form.values.teleFuel - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Teleop Fuel"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("teleFuel")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "teleFuel",
                Number(form.values.teleFuel! + 1)
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
                form.values.shotsMissed !== null &&
                form.values.shotsMissed > 0
              ) {
                form.setFieldValue(
                  "shotsMissed",
                  Number(form.values.shotsMissed - 1)
                );
              }
            }}
          >
            <Minus />
          </ActionIcon>
          <NumberInput
            label="Shots Missed"
            placeholder="0"
            className="pb-4 w-full"
            allowDecimal={false}
            allowNegative={false}
            hideControls
            inputMode="numeric"
            {...form.getInputProps("shotsMissed")}
          />
          <ActionIcon
            size={"2rem"}
            className="bg-[#2e2e2e] border-[0.0625rem] border-solid border-[#424242]"
            onClick={() => {
              form.setFieldValue(
                "shotsMissed",
                Number(form.values.shotsMissed! + 1)
              );
            }}
          >
            <Plus />
          </ActionIcon>
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot (successfully) drive over the bump?"
          {...form.getInputProps("bump", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot go under the trench?"
          {...form.getInputProps("trench", { type: "checkbox" })}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Endgame
        </div>

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot climb?"
          description="The robot successfully climbed during the endgame."
          checked={form.values.didClimb}
          onChange={(event) => {
            const checked = event.currentTarget.checked;
            form.setFieldValue("didClimb", checked);
            if (!checked) {
              form.setFieldValue("climbPosition", "");
              form.setFieldValue("climbLevel", "");
              form.setFieldValue("backClimb", false);
              form.setFieldValue("leftClimbLevelOne", false);
              form.setFieldValue("centerClimbLevelOne", false);
              form.setFieldValue("rightClimbLevelOne", false);
              form.setFieldValue("leftClimbLevelTwo", false);
              form.setFieldValue("centerClimbLevelTwo", false);
              form.setFieldValue("rightClimbLevelTwo", false);
              form.setFieldValue("leftClimbLevelThree", false);
              form.setFieldValue("centerClimbLevelThree", false);
              form.setFieldValue("rightClimbLevelThree", false);
            }
          }}
        />

        {form.values.didClimb && (
          <RadioGroup
            label="Climb Position"
            description="Where did the robot climb?"
            size="md"
            className="pb-4"
            value={form.values.climbPosition || ""}
            onChange={(value) => {
              form.setFieldValue("climbPosition", value as "left" | "center" | "right");
              form.setFieldValue("climbLevel", "");
              form.setFieldValue("backClimb", false);
              form.setFieldValue("leftClimbLevelOne", false);
              form.setFieldValue("centerClimbLevelOne", false);
              form.setFieldValue("rightClimbLevelOne", false);
              form.setFieldValue("leftClimbLevelTwo", false);
              form.setFieldValue("centerClimbLevelTwo", false);
              form.setFieldValue("rightClimbLevelTwo", false);
              form.setFieldValue("leftClimbLevelThree", false);
              form.setFieldValue("centerClimbLevelThree", false);
              form.setFieldValue("rightClimbLevelThree", false);
            }}
          >
            <Radio value="left" label="Left" className="pb-2" />
            <Radio value="center" label="Center" className="pb-2" />
            <Radio value="right" label="Right" className="pb-2" />
          </RadioGroup>
        )}

        {form.values.didClimb && form.values.climbPosition && (
          <RadioGroup
            label="Climb Level"
            description="What level did the robot climb to?"
            size="md"
            className="pb-4"
            value={form.values.climbLevel || ""}
            onChange={(value) => {
              const level = value as "one" | "two" | "three";
              form.setFieldValue("climbLevel", level);
              // Reset all 9 fields first
              form.setFieldValue("leftClimbLevelOne", false);
              form.setFieldValue("centerClimbLevelOne", false);
              form.setFieldValue("rightClimbLevelOne", false);
              form.setFieldValue("leftClimbLevelTwo", false);
              form.setFieldValue("centerClimbLevelTwo", false);
              form.setFieldValue("rightClimbLevelTwo", false);
              form.setFieldValue("leftClimbLevelThree", false);
              form.setFieldValue("centerClimbLevelThree", false);
              form.setFieldValue("rightClimbLevelThree", false);
              // Set the correct combined field
              const position = form.values.climbPosition;
              const levelMap = { one: "One", two: "Two", three: "Three" };
              const fieldName = `${position}ClimbLevel${levelMap[level]}` as keyof StandFormValues;
              form.setFieldValue(fieldName, true);
            }}
          >
            <Radio value="one" label="Top Level" className="pb-2" />
            <Radio value="two" label="Middle Level" className="pb-2" />
            <Radio value="three" label="Bottom Level" className="pb-2" />
          </RadioGroup>
        )}

        {form.values.didClimb && form.values.climbPosition && form.values.climbLevel && (
          <Checkbox
            className="pb-4"
            size="md"
            label="Did they climb at the back?"
            description="The robot climbed at the back of the tower."
            {...form.getInputProps("backClimb", { type: "checkbox" })}
          />
        )}

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

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot shuttle?"
          description="The robot moved game pieces between zones."
          {...form.getInputProps("shuttle", { type: "checkbox" })}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Could the robot move while shooting?"
          description="The robot was able to shoot while in motion."
          {...form.getInputProps("moveWhileShoot", { type: "checkbox" })}
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
