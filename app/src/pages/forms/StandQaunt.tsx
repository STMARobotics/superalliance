import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { useUser } from "@clerk/clerk-react";
import { useWindowScroll } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useForm, isNotEmpty } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Button,
  Group,
  TextInput,
  NumberInput,
  Affix,
  Transition,
  Select,
  ActionIcon,
} from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { Minus, Plus } from "lucide-react";


interface StandQuantValues {
    event: null | number;
    teamNumber: null | string | number;
    matchNumber: null | number;
    autoFuel: null | number;
    shotsMissed: null | number;
    teleFuel: null | number;
}

export default function QuantStandForm() {
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

    const form = useForm<StandQuantValues>({
        initialValues: {
            event: null,
            teamNumber: null,
            matchNumber: null,
            autoFuel: 0,
            shotsMissed: 0,
            teleFuel: 0,
        },
        validate: {
          event: isNotEmpty("This cannot be empty"),
          teamNumber: isNotEmpty("This cannot be empty"),
          matchNumber: isNotEmpty("This cannot be empty"),
        },
    });

    const submitForm = async (values: any) => {
        setSubmitPress(true);
        const struct = {
          usersName: user?.fullName,
          ...values,
        };
        await api
          .post(`${import.meta.env.VITE_API_URL}/api/form/standquant/submit`, struct)
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