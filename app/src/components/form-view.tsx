import { Checkbox, MultiSelect, TextInput, Textarea } from "@mantine/core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useUser } from "@clerk/clerk-react";

const FormView = ({ formData }: { formData: any }) => {
  const { eventTeams } = useSuperAlliance();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata.role == "admin";

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
        {eventTeams?.length > 0 &&
          ` • ${
            eventTeams?.filter(
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

      <TextInput
        value={formData?.autoCoralL1}
        readOnly
        label="Auto Coral Scored in L1"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoCoralL2}
        readOnly
        label="Auto Coral Scored in L2"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoCoralL3}
        readOnly
        label="Auto Coral Scored in L3"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoCoralL4}
        readOnly
        label="Auto Coral Scored in L4"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoAlgaeProcessor}
        readOnly
        label="Auto Algae Scored in the Algae Processor"
        className="pb-4"
      />

      <TextInput
        value={formData?.autoAlgaeNet}
        readOnly
        label="Auto Algae Scored in the Algae Net"
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
        value={formData?.teleopCoralL1}
        readOnly
        label="Teleop Coral Scored in L1"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleopCoralL2}
        readOnly
        label="Teleop Coral Scored in L2"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleopCoralL3}
        readOnly
        label="Teleop Coral Scored in L3"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleopCoralL4}
        readOnly
        label="Teleop Coral Scored in L4"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleopAlgaeProcessor}
        readOnly
        label="Teleop Algae Scored in the Algae Processor"
        className="pb-4"
      />

      <TextInput
        value={formData?.teleopAlgaeNet}
        readOnly
        label="Teleop Algae Scored in the Algae Net"
        className="pb-4"
      />

      <Checkbox
        checked={formData?.park}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot PARK?"
        description="The robot was parked at the end of the match"
      />

      <Checkbox
        checked={formData?.deepClimb}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot deep climb?"
        description="The robot successfully climbed and earned deep climb points."
      />

      <Checkbox
        checked={formData?.shallowClimb}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot shallow climb?"
        description="The robot successfully climbed and earned shallow climb points."
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
        value={formData?.comments ? formData?.strategy : "No strategy."}
        readOnly
        label="Overall strategy"
        className="pb-4"
        maxLength={750}
        autosize
      />

<Textarea
        value={formData?.comments ? formData?.comments : "No comments."}
        readOnly
        label="Extra Comments"
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
