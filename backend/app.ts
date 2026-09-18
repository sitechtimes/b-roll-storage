import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use(cors());

const Routes = require("./routes");
app.use(`/`, Routes);

mongoose.connect(process.env.MONGO_URI ?? "").catch((err) => {
  console.error("emerson mongo exploded! do you have .env? ", err);
});

mongoose.connection.once("open", async () => {
  console.log(
    "WE ARE THE EMERSON. WE ARE LOOSE AND WE STRIKE FEAR INTO THOSE WHO HEAR OUR NAME. EMERSON YANG, EMERSON YANG, EMERSON YANG",
  );
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
});
