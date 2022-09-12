const mongoose = require("mongoose");
const env = require("dotenv");

main();

env.config();

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

async function main() {
  await mongoose
    .connect(
      `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("mongo connect"))
    .catch((err) => console.log(err));
}
