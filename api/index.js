const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route.js");
const authRouter = require("./routes/auth.route.js");
const listingRouter = require("./routes/listing.route.js");

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

//allow json as input to the server
app.use(express.json());

app.use(cookieParser());

app.listen(5000, () => {
  console.log("Server is running on port 5000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

//middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
