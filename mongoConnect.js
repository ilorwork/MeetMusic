const mongoose = require("mongoose");
require("dotenv").config();

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

async function main() {
  await mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Mongo connection succeeded"))
    .catch((err) => console.log("Mongo connect fail. " + err));
}

main();
