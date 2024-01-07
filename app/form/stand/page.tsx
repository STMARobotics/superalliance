"use client";

import {
  Button,
  Checkbox,
  Group,
  TextInput,
  Box,
  Text,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";

export default function StandForm() {
  const [value, setValue] = useState<any>();
  const { user } = useUser();
  console.log(user?.fullName);
  const form = useForm({
    initialValues: {
      autoampsnotes: 0,
      autospeakersnotes: 0,
      park: false,
      teleampsnotes: 0,
      telespeakersnotes: 0,
      teletrapsnotes: 0,
      timesampedused: 0,
      onstage: false,
      onstagespotlit: false,
    },

    validate: {
      autoampsnotes: (value) => {
        return isNaN(value)
          ? "This is not a number!"
          : value > 100
          ? "This is too high!"
          : null;
      },
    },
  });
  return (
    <div className="pt-3 flex flex-col w-full justify-center items-center">
      <form
        onSubmit={form.onSubmit((values) => setValue(values))}
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
          className="pb-4"
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
          {...form.getInputProps("autoampsnotes")}
        />

        <NumberInput
          label="Notes Scored in Speakers"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("autospeakersnotes")}
        />

        <Checkbox
          className="pb-4"
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
          {...form.getInputProps("teleampsnotes")}
        />

        <NumberInput
          label="Notes Scored in Speakers"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("telespeakersnotes")}
        />

        <NumberInput
          label="Notes Scored in Traps"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("teletrapsnotes")}
        />

        <NumberInput
          label="How many times were the notes amped?"
          placeholder="0"
          className="pb-4"
          allowDecimal={false}
          allowNegative={false}
          hideControls
          {...form.getInputProps("timesampedused")}
        />

        <Checkbox
          className="pb-4"
          label="Did the robot go onstage?"
          {...form.getInputProps("onstage", { type: "checkbox" })}
        />

        {form.values?.onstage && (
          <Checkbox
            className="pb-4"
            label="Was it spotlit?"
            {...form.getInputProps("onstagespotlit", { type: "checkbox" })}
          />
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
