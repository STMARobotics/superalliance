import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useUser } from "@clerk/clerk-react";
import {
  Affix,
  Button,
  Group,
  NumberInput,
  Select,
  TextInput,
  Textarea,
  Transition,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { useWindowScroll } from "@mantine/hooks";
import { IconArrowUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSuperAllianceApi } from "@/lib/superallianceapi";

interface CommentsFormValues {
  event: null | number;
  teamNumber: null | number;
  comments: string;
}

export default function CommentsForm() {
  const [scroll, scrollTo] = useWindowScroll();
  const { user } = useUser();
  const navigate = useNavigate();
  const { events, appSettings } = useSuperAlliance();
  const [eventData, setEventData] = useState([]);
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
      form.setFieldValue("event", appSettings?.event);
    }
  });

  const form = useForm<CommentsFormValues>({
    initialValues: {
      event: null,
      teamNumber: null,
      comments: "",
    },

    validate: {
      event: isNotEmpty("This cannot be empty"),
      teamNumber: isNotEmpty("This cannot be empty"),
      comments: isNotEmpty("This cannot be empty"),
    },
  });

  const submitForm = async (values: any) => {
    const struct = {
      usersName: user?.fullName,
      ...values,
    };
    await api
      .post(`${import.meta.env.VITE_API_URL}/api/form/comments/submit`, struct)
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
          Stand Comments Form
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
          Comments
        </div>

        <Textarea
          label="Comments?"
          placeholder="Type some text here."
          className="pb-4"
          maxLength={750}
          autosize
          minRows={3}
          {...form.getInputProps("comments")}
        />

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
