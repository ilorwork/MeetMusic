const express = require("express");
const cors = require("cors");
const { routesInit } = require("./routes/baseRouts");
require("dotenv").config();
require("./mongoConnect");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));
// Allows the app to get a json format
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3000/"],
    credentials: true,
  })
);
app.use(express.static("client/build"));

routesInit(app);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is listening in port ${port}`);
});
