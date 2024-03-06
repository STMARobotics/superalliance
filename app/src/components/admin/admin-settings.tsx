import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

const adminSettingsSchema = z.object({
  event: z.string({
    required_error: "Please select an event to lock.",
  }),
});

type SettingsFormValues = z.infer<typeof adminSettingsSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  event: "none",
};

function AdminSettingsForm({
  events,
  settings,
}: {
  events: any;
  settings: Partial<SettingsFormValues>;
}) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: Object.keys(settings).length > 0 ? settings : defaultValues,
    mode: "onChange",
  });

  const { setSelectedEvent } = useSuperAlliance();

  function onSubmit(data: SettingsFormValues) {
    (async function () {
      await axios
        .post(`${import.meta.env.VITE_API_URL}/api/settings/app/save`, data)
        .then(function () {
          toast.success("Settings saved successfully!");
        })
        .catch(function () {
          toast.error("The settings failed to save. Please contact an admin!");
        });
      setSelectedEvent(data.event == "none" ? "all" : data.event);
    })();
  }
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block w-full">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage the <span className="text-red-500 font-bold">Super</span>
          <span className="text-blue-500 font-bold">Alliance</span> app
          configuration.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5"></aside>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="event"
            render={({ field }) => (
              <FormItem className="w-[35%]">
                <FormLabel>Event</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="relative">
                      <SelectValue placeholder="Select an event to lock!" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No Lock</SelectItem>
                    {events?.map((event: any) => (
                      <SelectItem
                        key={event.event_code}
                        value={event.event_code}
                      >
                        {event.short_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  You can manage verified email addresses in your{" "}
                  <Link to="/examples/forms">email settings</Link>.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update settings</Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminSettingsForm;
