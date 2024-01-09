import dbConnect from "@/lib/mongoose";
import StandFormSchema from "@/models/StandFormSchema";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  const data = await request.json();

  const sendForm = await new StandFormSchema({
    _id: new mongoose.Types.ObjectId(),
    teamNumber: data.teamNumber,
    usersName: data.usersName,
    autoAmpsNotes: data.autoAmpsNotes,
    autoSpeakersNotes: data.autoSpeakersNotes,
    park: data.park,
    teleAmpsNotes: data.teleAmpsNotes,
    teleSpeakersNotes: data.teleSpeakersNotes,
    teleTrapsNotes: data.teleTrapsNotes,
    timesAmpedUsed: data.timesAmpedUsed,
    onstage: data.onstage,
    onstageSpotlight: data.onstageSpotlight,
    harmony: data.harmony,
    selfSpotlight: data.selfSpotlight,
    criticals: data.criticals,
    comments: data.comments,
    rpEarned: data.rpEarned,
    defendedAgainst: data.defendedAgainst,
    defense: data.defense,
    stockpile: data.stockpile,
    underStage: data.underStage,
    win: data.win,
  });

  await sendForm.save().catch((err: any) => {
    console.log(err);
    return Response.json({ error: err }, { status: 500 });
  });

  return Response.json(`Form successfully submitted!`);
}
