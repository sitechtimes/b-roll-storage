import "dotenv/config";
import express from 'express';
import mongoose from "mongoose";
const app = express()
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const placeholderRoutes = require("./routes/index");
app.use(`/`, placeholderRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


mongoose.connect(process.env.MONGO_URI ?? "").catch((err) => {
  console.error("emerson mongo exploded! do you have .env? ", err);
});

mongoose.connection.once("open", async () => {
  console.log("the EMERSON is loose");
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
  });
});