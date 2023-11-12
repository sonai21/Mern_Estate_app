const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const userRouter = require("./routes/user.route.js");

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

app.use("/api/user", userRouter);
