"use client";

import {
  Button,
  Checkbox,
  Group,
  TextInput,
  Box,
  Text,
  NumberInput,
  Textarea,
  MultiSelect,
  SegmentedControl,
  Affix,
  Transition,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useUser } from "@clerk/clerk-react";
import { IconArrowUp } from "@tabler/icons-react";
import { useState } from "react";
import axios from "axios";
import { useWindowScroll } from "@mantine/hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function StandForm() {
  const [value, setValue] = useState<any>();
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const router = useRouter();

  const criticals = [
    "Robot Died",
    "Robot Tipped",
    "Red Card",
    "Mechanism Broke",
    "Bumper Malfunction",
  ];

  const form = useForm({
    initialValues: {
      teamNumber: null,
      autoAmpsNotes: null,
      autoSpeakersNotes: null,
      park: false,
      teleAmpsNotes: null,
      teleSpeakersNotes: null,
      teleTrapsNotes: null,
      timesAmpedUsed: null,
      onstage: false,
      onstageSpotlit: false,
      harmony: false,
      selfSpotlight: false,
      criticals: [],
      comments: "",
      rpEarned: null,
      defendedAgainst: false,
      defense: false,
      stockpile: false,
      underStage: false,
      win: false,
    },
    validate: {
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
      .post("/api/form/submit", JSON.stringify(struct))
      .catch(function (error) {
        toast.error("The form failed to submit. Please contact an admin!");
      });
    toast.success("The form has been submitted successfully!");
    router.push("/");
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

        <NumberInput
          label="Notes Scored in Amps"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("autoAmpsNotes")}
        />

        <NumberInput
          label="Notes Scored in Speakers"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("autoSpeakersNotes")}
        />

        <Checkbox
          className="pb-4"
          size="md"
          label="Did the robot park?"
          {...form.getInputProps("park", { type: "checkbox" })}
        />

        <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
          Teleop
        </div>

        <NumberInput
          label="Notes Scored in Amps"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("teleAmpsNotes")}
        />

        <NumberInput
          label="Notes Scored in Speakers"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("teleSpeakersNotes")}
        />

        <NumberInput
          label="Notes Scored in Traps"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("teleTrapsNotes")}
        />

        <NumberInput
          label="How many times were the notes amped?"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("timesAmpedUsed")}
        />

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

        <NumberInput
          label="How many ranking points were earned?"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("rpEarned")}
        />

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
          <Button type="submit" fullWidth h={"3rem"}>
            Submit
          </Button>
        </Group>
      </form>
    </div>
  );
}
