const express = require("express");
const cors = require("cors");
const { routesInit } = require("./routes/baseRouts");
require("./mongoConnect");
require("dotenv").config();

const app = express();

// Allows the app to get a json format
app.use(express.json());
app.use(cors());
app.use(express.static("client/build"));

routesInit(app);

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening in port ${process.env.PORT}`);
});
