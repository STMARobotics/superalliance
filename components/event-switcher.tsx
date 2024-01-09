"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarRange } from "lucide-react";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

interface EventSwitcherProps {
  isCollapsed: boolean;
  events: {
    short_name: string;
    event_code: string;
  }[];
}

export function EventSwitcher({ isCollapsed, events }: EventSwitcherProps) {
  const { selectedEvent, setSelectedEvent } = useSuperAlliance();
  if (!selectedEvent) setSelectedEvent("All Events");
  return (
    <Select
      defaultValue={!selectedEvent ? "All Events" : selectedEvent}
      onValueChange={setSelectedEvent}
    >
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select event"
      >
        <SelectValue placeholder="Select an event">
          <CalendarRange />
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {
              events.find((event) => event.short_name === selectedEvent)
                ?.short_name
            }
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {events.map((event) => (
          <SelectItem key={event.event_code} value={event.short_name}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              <CalendarRange />
              {event.short_name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
