import mongoose from "mongoose";
export interface StandForm extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  usersName: string;
  teamNumber: number;
  autoAmpsNotes: number;
  autoSpeakersNotes: number;
  park: boolean;
  teleAmpsNotes: number;
  teleSpeakersNotes: number;
  teleTrapsNotes: number;
  timesAmpedUsed: number;
  onstage: boolean;
  onstageSpotlit: boolean;
  harmony: boolean;
  selfSpotlight: boolean;
  criticals: string[];
  comments: string;
  rpEarned: number;
  defendedAgainst: boolean;
  defense: boolean;
  stockpile: boolean;
  underStage: boolean;
  win: boolean;
}

const StandFormSchema = new mongoose.Schema<StandForm>(
  {
    _id: mongoose.Schema.Types.ObjectId,
    usersName: String,
    teamNumber: Number,
    autoAmpsNotes: Number,
    autoSpeakersNotes: Number,
    park: Boolean,
    teleAmpsNotes: Number,
    teleSpeakersNotes: Number,
    teleTrapsNotes: Number,
    timesAmpedUsed: Number,
    onstage: Boolean,
    onstageSpotlit: Boolean,
    harmony: Boolean,
    selfSpotlight: Boolean,
    criticals: Array,
    comments: String,
    rpEarned: Number,
    defendedAgainst: Boolean,
    defense: Boolean,
    stockpile: Boolean,
    underStage: Boolean,
    win: Boolean,
  },
  { timestamps: true }
);

export default mongoose.models.StandForm ||
  mongoose.model<StandForm>("StandForm", StandFormSchema, "submittedForms");
