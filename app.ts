import express from 'express';
const app = express()
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const testRoutes = require("./routes/index");
app.use(`/`, testRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})