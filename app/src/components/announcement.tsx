import { ArrowRightIcon } from "@radix-ui/react-icons";

import { Separator } from "@/components/ui/separator";

export function Announcement() {
  return (
    <div
      className="inline-flex
      items-center
      rounded-lg
      bg-muted
      px-3
      py-1
      text-sm
      font-medium"
    >
      🎉 <Separator className="mx-2 h-4" orientation="vertical" />{" "}
      <span className="sm:inline">Super Alliance V2 is in progress!</span>
      <ArrowRightIcon className="ml-1 h-4 w-4" />
    </div>
  );
}
