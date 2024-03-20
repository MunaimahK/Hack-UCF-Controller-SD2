const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const url = require("url");
const { error } = require("console");
const cookieParser = require("cookie-parser");
// const port = process.env.PORT || 3001;
//const router = express.Router();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
    origin:
      "http://localhost:3000" ||
      "http://localhost:3001" ||
      "http://localhost:8000" ||
      "http://localhost:3002" ||
      "localhost:8000",
    credentials: true,
  })
);

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
    "http://localhost:3002",
    "localhost:8000",
    "localhost:3000",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

try {
  const db = mongoose.connect("mongodb://localhost:27017/Controller1");
  console.log("Connected");
} catch (error) {
  handleError(error);
}

app.use("/", require("./Routes/routes"));

app.listen(8000, function(err) {
  if (err) console.log(err);
  console.log("Server listening on PORT");
});
