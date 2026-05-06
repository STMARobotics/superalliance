import { TextInput, Textarea } from "@mantine/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";

const ReadOnlyField = ({
  label,
  description,
  value,
  multiline = false,
}: {
  label: string;
  description: string;
  value: string;
  multiline?: boolean;
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{label}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        {multiline ? (
          <Textarea value={value} readOnly autosize minRows={2} />
        ) : (
          <TextInput value={value} readOnly />
        )}
      </CardContent>
    </Card>
  );
};

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
      </CardContent>
    </Card>
  );
};

const PitFormView = ({
  pitFormData,
}: {
  pitFormData: any;
}) => {
  const boolToYesNo = (value: unknown) => (value ? "Yes" : "No");

  return (
    <div>
      {pitFormData ? (
        <div className="space-y-4 pt-3">
          <SectionCard title="Mechanical/Electrical">
            <ReadOnlyField
              label="Protected Electronics"
              description="Were the electronics protected?"
              value={boolToYesNo(pitFormData?.protectedElectronics)}
            />
            <ReadOnlyField
              label="Battery Secured"
              description="How was the battery secured?"
              value={boolToYesNo(pitFormData?.batterySecured)}
            />
            <ReadOnlyField
              label="High Center Of Mass"
              description="Does the robot have a high center of mass?"
              value={boolToYesNo(pitFormData?.highCenterOfMass)}
            />
          </SectionCard>

          <SectionCard title="Driveteam/Competition">
            <ReadOnlyField
              label="Pickup Ground"
              description="Did the robot pickup from the ground?"
              value={boolToYesNo(pitFormData?.pickupGround)}
            />
            <ReadOnlyField
              label="Pickup Source"
              description="Did the robot pickup from a source?"
              value={boolToYesNo(pitFormData?.pickupSource)}
            />
            <ReadOnlyField
              label="Pickup Other"
              description="Did the robot pickup by other means?"
              value={boolToYesNo(pitFormData?.pickupOther)}
            />
            {pitFormData?.pickupOther && (
              <ReadOnlyField
                label="Pickup Other Explain"
                description="Explain other."
                value={pitFormData?.pickupOtherExplain || "-"}
                multiline
              />
            )}
            <ReadOnlyField
              label="Ideal Auto"
              description="Ideal auto?"
              value={pitFormData?.idealAuto || "-"}
              multiline
            />
          </SectionCard>

          <SectionCard title="General">
            <ReadOnlyField
              label="Strongest Value"
              description="Strongest value on robot?"
              value={pitFormData?.strongestValue || "-"}
              multiline
            />
            <ReadOnlyField
              label="Weakest Value"
              description="Weakest value on robot?"
              value={pitFormData?.weakestValue || "-"}
              multiline
            />
            <ReadOnlyField
              label="Contact Info"
              description="Team contact information"
              value={pitFormData?.contactInfo || "-"}
              multiline
            />
            <ReadOnlyField
              label="Extra Comments"
              description="Any extra comments?"
              value={pitFormData?.extraComments || "-"}
              multiline
            />
          </SectionCard>

          <SectionCard title="Submission Details">
            <ReadOnlyField
              label="Submitted By"
              description="Scout/user who submitted this pit form"
              value={pitFormData?.usersName || "Unknown"}
            />
          </SectionCard>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold">No pit form found!</h1>
          <p className="text-xl text-center text-muted-foreground">
            Please submit a pit form for this team!
          </p>
        </div>
      )}
    </div>
  );
};

export default PitFormView;
