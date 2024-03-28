const mongoose = require("mongoose");
require("dotenv").config();

const connectString = process.env.CONNECTION_STRING;

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected mongodb success`))
  .catch((err) => console.log(`Error Connect`, err));

module.exports = mongoose;
