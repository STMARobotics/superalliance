const app = require("./index");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(console.log("Connected to Mongo!"))
  .catch(console.error);
// run the server locally
app.listen(3000, () =>
  console.log("Server listening at http://localhost:3000")
);
