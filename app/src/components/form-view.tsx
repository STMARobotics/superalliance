import { Checkbox, MultiSelect, TextInput, Textarea } from "@mantine/core";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSuperAlliance } from "@/contexts/SuperAllianceProvider";
import { useUser } from "@clerk/clerk-react";

const FormView = ({ formData }: { formData: any }) => {
  const { eventTeams } = useSuperAlliance();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata.role == "admin";

  const getClimbInfo = () => {
    const positions = ["left", "center", "right"];
    const levels = ["One", "Two", "Three"];
    for (const position of positions) {
      for (const level of levels) {
        const fieldName = `${position}ClimbLevel${level}`;
        if (formData?.[fieldName]) {
          return {
            position: position.charAt(0).toUpperCase() + position.slice(1),
            level: level === "One" ? "Top" : level === "Two" ? "Middle" : "Bottom"
          };
        }
      }
    }
    return null;
  };

  const climbInfo = getClimbInfo();

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


      <Checkbox
        checked={formData?.autoClimb}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot climb during auto?"
        description="The robot successfully climbed during the autonomous period."
      />

      <Checkbox
        checked={formData?.auto}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot move during auto?"
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Teleop
      </div>

      <Checkbox
        checked={formData?.bump}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot (successfully) drive over the bump?"
      />

      <Checkbox
        checked={formData?.trench}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot go under the trench?"
      />

      <div className="text-gray-300 pb-6 text-center text-3xl font-bold leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
        Endgame
      </div>

      <Checkbox
        checked={formData?.didClimb}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot climb?"
        description="The robot successfully climbed during the endgame."
      />

      {formData?.didClimb && climbInfo && (
        <>
          <TextInput
            value={climbInfo.position}
            readOnly
            label="Climb Position"
            className="pb-4"
          />

          <TextInput
            value={`${climbInfo.level} Level`}
            readOnly
            label="Climb Level"
            className="pb-4"
          />

          <Checkbox
            checked={formData?.backClimb}
            readOnly
            className="pb-4"
            size="md"
            label="Did they climb at the back?"
            description="The robot climbed at the back of the tower."
          />
        </>
      )}

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
        value={formData?.strategy ? formData?.strategy : "No strategy."}
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

      <Checkbox
        checked={formData?.shuttle}
        readOnly
        className="pb-4"
        size="md"
        label="Did the robot shuttle?"
        description="The robot moved game pieces between zones."
      />

      <Checkbox
        checked={formData?.moveWhileShoot}
        readOnly
        className="pb-4"
        size="md"
        label="Could the robot move while shooting?"
        description="The robot was able to shoot while in motion."
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
