import { Checkbox, MultiSelect, TextInput, Textarea } from "@mantine/core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useUser } from "@clerk/clerk-react";

const FormView = ({ formData }: { formData: any }) => {
  const { teams } = useSuperAlliance();
  const { user } = useUser();

  const isAdmin = user?.organizationMemberships[0]?.role == "org:admin";

  return (
    <>
      <div className="pb-4 text-center text-4xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] flex flex-row items-center justify-center">
        Stand Scouting Form{" "}
      </div>

      <div className="flex justify-center items-center pb-4">
        {isAdmin ? (
          <Badge className="text-sm" variant="outline">
            Admin Mode
          </Badge>
        ) : (
          <Badge className="text-sm" variant="outline">
            Read-only
          </Badge>
        )}
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

      {isAdmin && (
        <div className="text-gray-400 pb-8 text-center text-xl font-bold leading-tight tracking-tighter md:text-xl lg:leading-[1.1]">
          Form ID: {formData?._id}{" "}
        </div>
      )}

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
        value={formData?.matchNumber}
        label="Match Number"
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

      <Checkbox.Group
        defaultValue={[]}
        label="Did the robot touch the notes from the middle of the field?"
        description="1 being closest to the scoring table, 5 being farthest away. (Choose in the order of being touched)"
        className="pb-4"
        value={formData?.autoMiddleNotes}
      >
        <div className="mt-3 flex flex-col gap-2">
          {formData?.autoMiddleNotes.length > 0 && (
            <div className="text-gray-300 text-md font-bold leading-tight tracking-tighter lg:leading-[1.1]">
              {formData?.autoMiddleNotes.join(" -> ")}
            </div>
          )}
          <Checkbox
            size="md"
            value="1"
            label="Position 1 (Closest note to Scoring Table)"
          />
          <Checkbox size="md" value="2" label="Position 2" />
          <Checkbox size="md" value="3" label="Position 3" />
          <Checkbox size="md" value="4" label="Position 4" />
          <Checkbox
            size="md"
            value="5"
            label="Position 5 (Farthest note from Scoring Table)"
          />
        </div>
      </Checkbox.Group>

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
        checked={formData?.leave}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot LEAVE?"
        description="The robot's bumpers fully left the starting area at any point during the autonomous period."
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Teleop
      </div>

      <TextInput
        value={formData?.teleAmpsNotes}
        readOnly
        label="Amp Notes Scored"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleSpeakersNotes}
        readOnly
        label="Speaker Notes Scored"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleAmplifiedSpeakersNotes}
        readOnly
        label={
          <>
            <span
              className="text-[#e03131]"
              style={{ textShadow: "0 0 4px #e03131" }}
            >
              Amplified
            </span>{" "}
            Speaker Notes Scored
          </>
        }
        className="pb-4"
      />

      <TextInput
        value={formData?.teleTrapsNotes}
        readOnly
        label="Trap Notes Scored"
        className="pb-4"
      />

      <Checkbox
        checked={formData?.park}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot PARK?"
        description="Any part of the robot's bumpers were in the stage zone at the end of the match."
      />

      <Checkbox
        checked={formData?.onstage}
        readOnly
        className="pb-4"
        size="md"
        label="Was the robot ONSTAGE?"
        description="The robot successfully climbed and earned climb points."
      />

      {formData?.onstage && (
        <Checkbox
          checked={formData?.onstageSpotlit}
          readOnly
          className="pb-4 ml-7"
          size="md"
          label="Was it spotlit?"
        />
      )}

      <Checkbox
        checked={formData?.harmony}
        readOnly
        className="pb-4"
        size="md"
        label="Was HARMONY achieved?"
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
        value={
          formData?.criticals?.length > 0
            ? formData?.criticals
            : ["No criticals"]
        }
        readOnly
        label="Criticals"
        className="pb-4"
      />

      <Textarea
        value={formData?.comments ? formData?.comments : "No comments."}
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
