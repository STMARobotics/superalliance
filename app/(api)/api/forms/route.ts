import dbConnect from "@/lib/mongoose";
import StandFormSchema from "@/models/StandFormSchema";

export async function GET() {
  await dbConnect();
  const forms = await StandFormSchema.find({}).sort({
    _id: -1,
  });
  return Response.json(forms);
}
