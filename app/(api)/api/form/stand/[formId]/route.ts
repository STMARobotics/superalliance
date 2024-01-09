import dbConnect from "@/lib/mongoose";
import StandFormSchema from "@/models/StandFormSchema";

export async function GET(
  request: Request,
  { params }: { params: { formId: string } }
) {
  await dbConnect();
  const data = await StandFormSchema.find({
    _id: params.formId,
  }).catch((err) => null);
  if (!data)
    return Response.json({ error: "Form not found!" }, { status: 404 });
  return Response.json(data);
}
