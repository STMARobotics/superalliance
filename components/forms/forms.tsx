import { useState } from "react";
import FormList from "@/components/forms/form-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import FormView from "@/components/form-view";
import { ScrollArea } from "@mantine/core";
import { Separator } from "@/components/ui/separator";
import { FileDigit, Home, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/forms/form-nav";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EventSwitcher } from "../event-switcher";
import { usePathname } from "next/navigation";

function Forms({ forms, events }: { forms: any; events: any }) {
  const [selectedForm, setSelectedForm] = useState<any>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const newEvents = [{ short_name: "All Events", event_code: "all" }].concat(
    events
  );
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          collapsible={true}
          minSize={15}
          maxSize={20}
          defaultSize={265}
          onCollapse={() => setIsCollapsed(true)}
          onExpand={() => setIsCollapsed(false)}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            {events && (
              <EventSwitcher isCollapsed={isCollapsed} events={newEvents} />
            )}
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "All",
                label: forms?.length,
                icon: Home,
                variant: pathname == "/data/forms" ? "default" : "ghost",
                link: "/data/forms",
              },
              {
                title: "Teams",
                label: "1",
                icon: FileDigit,
                variant: pathname == "/data/teams" ? "default" : "ghost",
                link: "/data/teams",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={440}>
          <Tabs defaultValue="stand">
            <div className="h-[52px] flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Forms</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="stand"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Stand Forms
                </TabsTrigger>
                <TabsTrigger
                  value="pit"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Pit Forms
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="stand" className="m-0">
              <ScrollArea h={"100vh"} w={"100%"}>
                <FormList
                  forms={forms}
                  selectedForm={selectedForm}
                  setSelectedForm={setSelectedForm}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="pit" className="m-0">
              <h1>Coming soon</h1>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30} defaultSize={655}>
          <ScrollArea className="h-full p-10">
            {selectedForm ? (
              <FormView
                formData={
                  forms.filter((form: any) => form._id == selectedForm)[0]
                }
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-4xl font-bold">No form selected</h1>
                <p className="text-xl text-center text-muted-foreground">
                  Select a form from the list to view it
                </p>
              </div>
            )}
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}

export default Forms;
