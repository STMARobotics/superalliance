import { Button } from "@/components/ui/button";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useSuperAllianceApi } from "@/lib/superallianceapi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@mantine/core";
import { LoaderCircle, Send, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import ReactMarkdown from "react-markdown"; // <--- Add this import

function AIScouting() {
  const { appSettings, events } = useSuperAlliance();
  const { queryScoutingAssistant } = useSuperAllianceApi();
  const [eventChoice, setEventChoice] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const activeEvent = appSettings?.event && appSettings.event !== "none" ? appSettings.event : null;
  const activeEventName = events?.find((event: any) => event.event_code === activeEvent)?.short_name || activeEvent;
  const queryEvent = eventChoice || activeEvent || "all";
  const queryEventName = queryEvent === "all"
    ? "All events"
    : events?.find((event: any) => event.event_code === queryEvent)?.short_name || queryEvent;
  const eventOptions = [...(events || [])];
  if (activeEvent && !eventOptions.some((event: any) => event.event_code === activeEvent)) {
    eventOptions.push({ event_code: activeEvent, short_name: activeEventName });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setAnswer("");
    setError("");
    try {
      setAnswer(await queryScoutingAssistant(prompt.trim(), queryEvent));
    } catch (queryError) {
      setError(queryError instanceof Error ? queryError.message : "The scouting query failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-0 w-full overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        <header className="mb-7 space-y-3">
          <h2 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Sparkles aria-hidden="true" className="h-6 w-6 text-amber-500" />
            AI Scouting Assistant
          </h2>
        </header>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-border p-4 sm:p-5">
          <label htmlFor="scouting-event" className="text-sm font-medium">Event</label>
          <Select value={queryEvent} onValueChange={setEventChoice} disabled={isLoading}>
            <SelectTrigger id="scouting-event" aria-label="Event to query">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              {eventOptions.map((event: any) => (
                <SelectItem key={event.event_code} value={event.event_code}>
                  {event.short_name || event.event_code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <label htmlFor="scouting-prompt" className="text-sm font-medium">
            Ask about scouting data
          </label>
          <Textarea
            id="scouting-prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.currentTarget.value)}
            placeholder="Which teams at this event have never climbed?"
            minRows={4}
            maxRows={10}
            maxLength={2000}
            autosize
            disabled={isLoading}
            aria-describedby="scouting-prompt-limit"
            className="w-full"
          />
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span id="scouting-prompt-limit" className="text-xs text-muted-foreground">
              {prompt.length}/2000
            </span>
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? (
                <LoaderCircle aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send aria-hidden="true" className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Analyzing scouting data…" : "Ask assistant"}
            </Button>
          </div>
        </form>

        {error && (
          <p role="alert" className="mt-6 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {isLoading && (
          <div role="status" aria-live="polite" className="mt-7 flex items-center gap-3 text-sm text-muted-foreground">
            <LoaderCircle aria-hidden="true" className="h-5 w-5 animate-spin" />
            Reviewing {queryEventName} scouting data…
          </div>
        )}

        {answer && !isLoading && (
          <section aria-live="polite" className="mt-8 border-l-2 border-amber-500 pl-5">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-amber-500" />
              Scouting insight
            </h3>
            
            <div className="text-sm text-foreground sm:text-base space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_strong]:font-bold">
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default AIScouting;