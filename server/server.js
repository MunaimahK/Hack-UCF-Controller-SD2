require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const url = require("url");
const { error } = require("console");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 8001;
//const router = express.Router();

const app = express();

app.use(
  cors({
    "Access-Control-Allow-Credentials": true,
    origin:
      "http://localhost:3000" ||
      "http://localhost:3001" ||
      "http://localhost:8000" ||
      "http://localhost:3002" ||
      "http://localhost:3003" ||
      "localhost:8000",
    credentials: true,
  })
);

const corsOptions = {
  "Access-Control-Allow-Origin": "http://localhost:3003",
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:8000",
    "http://localhost:3002",
    "http://localhost:3003",
    "localhost:8000",
    "localhost:3000",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
/*app.use((req, res, next) => {
  //res.setHeader("Access-Control-Allow-Origin: http://localhost:3003");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});*/
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://localhost:3003");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
app.options("/create-checkout-session", cors());
try {
  // replace {controller2} with .env file value
  const db = mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");
} catch (error) {
  console.log(process.env.DB_NAME);
  handleError(error);
}

app.use("/", require("./Routes/routes"));

// replace {controller2} with .env file value
app.listen(8001, function(err) {
  if (err) console.log(err);
  console.log("Server listening on");
});
