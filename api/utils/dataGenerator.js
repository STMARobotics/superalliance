const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const StandFormSchema = require("../models/StandFormSchema");

mongoose.connect(
  "mongodb+srv://Vincent:RocMon64-7028@7028recon.g5bjgnx.mongodb.net/SuperAlliance",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const teamNumbers = [
  "4607",
  "5172",
  "2192",
  "2883",
  "6045",
  "254",
  "1323",
  "2502",
  "2052",
  "2169",
  "2175",
  "2654",
  "2225",
  "2239",
  "2264",
  "2823",
  "2470",
];

const criticals = [
  "Robot Died",
  "Robot Tipped",
  "Red Card",
  "Mechanism Broke",
  "Bumper Malfunction",
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomBool() {
  return Math.random() < 0.5;
}

function getRandomSubmission(teamNumber, matchNumber) {
  const shuffledCriticals = criticals.sort(() => 0.5 - Math.random());
  const selectedCriticals = shuffledCriticals.slice(
    0,
    getRandomInt(criticals.length)
  );
  return new StandFormSchema({
    _id: new mongoose.Types.ObjectId(),
    usersName: "copilot",
    event: "ndgf",
    teamNumber: teamNumber,
    matchNumber: matchNumber,
    autoAmpsNotes: getRandomInt(17),
    autoSpeakersNotes: getRandomInt(17),
    park: getRandomBool(),
    teleAmpsNotes: getRandomInt(17),
    teleSpeakersNotes: getRandomInt(17),
    teleTrapsNotes: getRandomInt(17),
    timesAmpedUsed: getRandomInt(17),
    onstage: getRandomBool(),
    onstageSpotlit: getRandomBool(),
    harmony: getRandomBool(),
    selfSpotlight: getRandomBool(),
    criticals: selectedCriticals,
    comments: faker.random.words(4),
    rpEarned: getRandomInt(5),
    defendedAgainst: getRandomBool(),
    defense: getRandomBool(),
    stockpile: getRandomBool(),
    underStage: getRandomBool(),
    win: getRandomBool(),
  });
}

const numFormsPerTeam = 23;
const numTeams = teamNumbers.length;
for (let teamIndex = 0; teamIndex < numTeams; teamIndex++) {
  for (let formIndex = 0; formIndex < numFormsPerTeam; formIndex++) {
    const matchNumber = formIndex + 1;
    const teamNumber = teamNumbers[teamIndex];
    const submission = getRandomSubmission(teamNumber, matchNumber); // assuming getRandomSubmission can take matchNumber as parameter
    submission.save().then((result) => {
      console.log(result);
    });
  }
}
