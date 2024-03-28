const express = require("express");
const { notFound, errHandler } = require("./middlewares/errHandler");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to MongoDb
require("./configs/dbConnect");

//Connect to express server
app.listen(process.env.PORT || 8888, () => {
  console.log(`Server running on Port ${process.env.PORT}`);
});

//Init routes
app.use("/", require("./routes"));

// //Handling Error
app.use(notFound)
app.use(errHandler)
