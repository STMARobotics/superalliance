import { Badge } from "@mantine/core";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SelectionCriticals = ({ criticals }: { criticals: any[] }) => {
  return (
    <div className="space-y-2">
      {criticals.map((match: any, index: any) => (
        <div key={index}>
          {match.criticals?.length > 0 && (
            <Card key={index}>
              <CardHeader>
                <CardTitle>Match #{match.matchNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-x-2">
                  {match.criticals?.map((crit: any, index: any) => {
                    return (
                      <Badge
                        key={index + 1}
                        color={"white"}
                        variant={"outline"}
                      >
                        {crit}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="justify-between space-x-2">
                <Button className="w-full">View Form</Button>
                <Button className="w-full bg-red-500 hover:bg-red-700 text-white">
                  View YouTube
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};

export default SelectionCriticals;
