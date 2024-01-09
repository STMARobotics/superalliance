import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: { team: string; year: string } }
) {
  if (!params.team || !params.year)
    return Response.json({ error: "Missing team or year" }, { status: 500 });
  const data = await axios.get(
    `https://www.thebluealliance.com/api/v3/team/frc${params.team}/events/${params.year}`,
    {
      headers: {
        "X-TBA-Auth-Key": `${process.env.TBA_KEY}`,
        accept: "application/json",
      },
    }
  );
  if (!data?.data)
    return Response.json({ error: "Form not found!" }, { status: 404 });
  return Response.json(data.data);
}
