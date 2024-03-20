const User = require("../Models/AdminSchema.js");
const clubMember = require("../Models/user-model.js");
const Admin = require("../Models/admin-model.js");
const { hashPwd, comparePwd } = require("../helpers/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv");
const cookies = require("cookies");
const test = (req, res) => {
  res.json("test is working");
};

require("dotenv").config();

const firstTimeQ = async (req, res) => {
  try {
    // console.log(req);
    console.log(req.query);
    // rename req.body information sent by user
    const UID = req.query.UID;
    const { name, major, gradDate, clubName } = req.query.data;
    console.log(name);
    console.log(major);
    console.log(gradDate);
    console.log(clubName);

    // three if statements check if form fields are entered
    // toast picks up error body and displays as notification
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }
    if (!major) {
      return res.json({
        error: "major is required",
      });
    }
    if (!gradDate) {
      return res.json({
        error: "Grad Date Required",
      });
    }
    if (!clubName) {
      return res.json({
        error: "Club Name Required",
      });
    }

    const exist = await clubMember.findOne({ UID });
    if (exist) {
      return res.json({
        error: true,
      });
    }

    // create a hashed password using hashPwd helper function
    // const hashedPwd = await hashPwd(password);
    //console.log("Addded");
    // create user with req.body infromation
    const user = clubMember.create({
      UID,
      name,
      major,
      gradDate,
      clubName,
      customQ: [],
    });

    (await user).save();

    if (clubMember.find()) {
      console.log("Addded");
    }
    return res.json(user.clubName);
  } catch (error) {
    console.log(error);
  }
};

const updateQR = async (req, res) => {
  // console.log("request from qr on main", req);
  // console.log(req);
  // const uid = req.query;
  // console.log(uid);
  //const exist = await User1.findOne({ UID: req });
  //if (exist) {
  return res.json({
    error: "test",
  });
  //}
};
const defaultAdmin = async (req, res) => {
  const password = "123456";
  const hashedPwd = await hashPwd(password);
  var count = 0;

  const admin = await Admin.findOne({
    username: "default",
    password: hashedPwd,
  });
  if (!admin) {
    try {
      var defAdmin = new Admin({
        username: "default",
        password: hashedPwd,
      });
      if (count == 0) {
        await defAdmin.save();
        count = 1;
      }
      console.log("success");
    } catch (error) {
      console.log(error);
    }
  } else {
    return res.json({ error: true });
  }
};
// Register Endpoint; endpoint connected to route in LoginOut.js
const register = async (req, res) => {
  try {
    // rename req.body information sent by user
    const { email, username, password } = req.body;
    // three if statements check if form fields are entered
    // toast picks up error body and displays as notification
    if (!email) {
      return res.json({
        error: "Email is required",
      });
    }
    if (!username) {
      return res.json({
        error: "username is required",
      });
    }
    if (!password || password.length < 6) {
      return res.json({
        error: "pwd is required and should be greater than 6 letters",
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "Email Exists",
      });
    }

    // create a hashed password using hashPwd helper function
    const hashedPwd = await hashPwd(password);

    // create user with req.body infromation
    const user = User.create({
      email,
      username,
      password: hashedPwd,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};
// Login Endpoint;endpoint connected to route in LoginOut.js
const login = async (req, res) => {
  defaultAdmin(req, res);
  try {
    // take the username user logs in with and store in const username
    const { username, password } = req.body;
    console.log("username", username, password);
    // Check if user exists
    const user = await Admin.findOne({ username });
    console.log(user);
    if (!user) {
      return res.json({
        error: "No user found",
      });
    }

    // If user exists, then check passwords match
    const match = await comparePwd(password, user.password);
    console.log(match);

    if (match) {
      jwt.sign(
        { username: user.username, id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res
            .cookie("token", token)
            .json(user)
            .status(200);
          res.json("Password Match");
        }
      );
    } else {
      return res.json({
        error: "Incorrect Password",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const Logout = async (req, res) => {
  console.log(req.cookies.token);
  res.clearCookie("token");
  res.status(200).json({ error: true });
};
const profile = (req, res) => {
  try {
    const { token } = req.cookies.token;
    console.log(token);
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        res.json(decoded);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          console.error("JWT token has expired");
          // Handle expired token error
        } else if (err.name === "JsonWebTokenError") {
          console.error("JWT verification failed:", err.message);
          // Handle other JWT verification errors
        } else {
          console.error("JWT verification failed:", err);
          // Handle other errors
        }
      }
      /*
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) {
        throw err;
      }
      console.log("here");
      res.json(user);
      if (err) {
        if (err.name === "TokenExpiredError") {
          console.error("JWT token has expired");
          // Handle expired token error
        } else if (err.name === "JsonWebTokenError") {
          console.error("JWT verification failed:", err.message);
          // Handle other JWT verification errors
        } else {
          console.error("JWT verification failed:", err);
          // Handle other errors
        }
      } else {
        console.log("Decoded token:", user);
        res.json(user);
      }
    });*/
    } else {
      res.json({ error: true });
    }
  } catch (err) {
    console.log(err);
  }
};

const display = (req, res) => {
  clubMember
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};
const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  console.log("token", token);
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.clearCookie("access_token");
    // token = req.cookies.access_token;
    if (!token) {
      console.log("here");
      res.redirect(301, "http://localhost:3000/");
    }
  }
};

const customQ = async (req, res) => {
  return res.json({ error: true });

  /*custom q:

  Software Development Experience (1/2/3/4/5) [How much do you know about software development?]
  */
};
module.exports = {
  test,
  register,
  login,
  profile,
  display,
  firstTimeQ,
  authenticate,
  updateQR,
  defaultAdmin,
  Logout,
  customQ,
};
