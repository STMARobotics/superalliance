import { Checkbox, MultiSelect, TextInput, Textarea } from "@mantine/core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";

const FormView = ({ formData }: { formData: any }) => {
  const { teams } = useSuperAlliance();

  return (
    <>
      <div className="pb-4 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] flex flex-row items-center justify-center">
        Stand Scouting Form{" "}
      </div>

      <div className="flex justify-center items-center pb-4">
        <Badge className="text-sm" variant="outline">
          Read-only
        </Badge>
      </div>

      <div className="text-red-500 pb-6 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
        #{formData?.teamNumber}
        {teams?.length > 0 &&
          ` • ${
            teams?.filter(
              (team: any) => team.teamNumber == formData?.teamNumber
            )[0]?.teamName
          }`}
      </div>

      <div className="text-gray-400 pb-8 text-center text-xl font-bold leading-tight tracking-tighter md:text-xl lg:leading-[1.1]">
        Form ID: {formData?._id}{" "}
      </div>

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Pre-Game
      </div>
      <TextInput
        value={formData?.usersName}
        label="User's Name"
        className="pb-4"
        readOnly
      />

      <TextInput
        value={formData?.teamNumber}
        label="Team Number"
        className="pb-4"
        readOnly
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Autonomous
      </div>

      <TextInput
        value={formData?.autoAmpsNotes}
        readOnly
        label="Notes Scored in Amps"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoSpeakersNotes}
        readOnly
        label="Notes Scored in Speakers"
        className="pb-4"
      />

      <Checkbox
        checked={formData?.park}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot park?"
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Teleop
      </div>

      <TextInput
        value={formData?.teleAmpsNotes}
        readOnly
        label="Notes Scored in Amps"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleSpeakersNotes}
        readOnly
        label="Notes Scored in Speakers"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleTrapsNotes}
        readOnly
        label="Notes Scored in Traps"
        className="pb-4"
      />

      <TextInput
        value={formData?.timesAmpedUsed}
        readOnly
        label="How many times were the notes amped?"
        className="pb-4"
      />

      <Checkbox
        checked={formData?.onstage}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot go onstage?"
      />

      <Checkbox
        checked={formData?.onstageSpotlit}
        readOnly
        className="pb-4 ml-7"
        size="md"
        label="Was it spotlit?"
      />

      <Checkbox
        checked={formData?.harmony}
        readOnly
        className="pb-4"
        size="md"
        label="Was harmony achieved?"
      />

      <Checkbox
        checked={formData?.selfSpotlight}
        readOnly
        className="pb-4"
        size="md"
        label="Was your teams player able to spotlight?"
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Post-Match
      </div>

      <MultiSelect
        value={formData?.criticals}
        readOnly
        label="Criticals"
        className="pb-4"
      />

      <Textarea
        value={formData?.comments}
        readOnly
        label="Comments?"
        className="pb-4"
        maxLength={750}
        autosize
      />

      <TextInput
        value={formData?.rpEarned}
        readOnly
        label="How many ranking points were earned?"
        className="pb-4"
      />

      <Checkbox
        checked={formData?.defendedAgainst}
        readOnly
        className="pb-4"
        size="md"
        label="Was the your team's bot defended against?"
      />

      <Checkbox
        checked={formData?.defense}
        readOnly
        className="pb-4"
        size="md"
        label="Did your team defend?"
      />

      <Checkbox
        checked={formData?.stockpile}
        readOnly
        className="pb-4"
        size="md"
        label="Did your team stockpile notes?"
      />

      <Checkbox
        checked={formData?.underStage}
        readOnly
        className="pb-4"
        size="md"
        label="Could your robot go under the stage?"
      />

      <Separator />

      <Checkbox
        checked={formData?.win}
        readOnly
        className="pt-4 pb-6"
        size="lg"
        label="Did the team win?"
      />
    </>
  );
};

export default FormView;
