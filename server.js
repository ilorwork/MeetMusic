const express = require("express");
const cors = require("cors");
const { routesInit } = require("./routes/baseRouts");
require("dotenv").config();
require("./mongoConnect");
const cookieParser = require("cookie-parser");

const app = express();

// Allows the app to get a json format
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static("client/build"));

routesInit(app);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
});
