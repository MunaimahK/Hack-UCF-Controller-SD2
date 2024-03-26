const User = require("../Models/AdminSchema.js");
const clubMember = require("../Models/user-model.js");
const cQ = require("../Models/custom-question-model.js");
const Admin = require("../Models/admin-model.js");
const mongoose = require("mongoose");
const { hashPwd, comparePwd } = require("../helpers/auth.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookies = require("cookies");
let countDefAdmin = 0;
const test = (req, res) => {
  res.json("test is working");
};

require("dotenv").config();

const firstTimeQ = async (req, res) => {
  try {
    console.log(req);

    const f_name = req.query.f_name;
    const surname = req.query.surname;
    const email = req.query.email;
    const NID = req.query.NID;
    const Gender = req.query.Gender;
    const major = req.query.major;
    const classStanding = req.query.classStanding;
    const UID = req.query.UID;
    console.log(UID, f_name, surname, email, NID, Gender, major, classStanding);

    const exist = await clubMember.findOne({ UID });
    if (exist) {
      return res.json({
        error: true,
      });
    }
    const user = clubMember.create({
      UID,
      f_name,
      surname,
      email,
      NID,
      Gender,
      major,
      classStanding,
      paidDues: false,
      customQ: [],
    });

    (await user).save();

    if (clubMember.find()) {
      console.log("Addded");
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const updateQR = async (req, res) => {
  return res.json({
    error: "test",
  });
};
const defaultAdmin = async (req, res) => {
  const password = "123456";
  const hashedPwd = await hashPwd(password);

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
      if (countDefAdmin == 0) {
        await defAdmin.save();
        countDefAdmin = 1;
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
    } else {
      res.json({ error: true });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: true });
  }
};

const display = (req, res) => {
  clubMember
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
};
/*
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
};*/

const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    // console.log("AUTHENTICATE:   ", req);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("TOKEN EXPIRED");
      token = req.cookies.refresh_token;
      user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      console.log("AUTHENTICATE:   ", req.user);
    }
    res.clearCookie(token);
    console.log(error);
    res.send(req.user);
  }
};
const retrieveCustomQ = async (req, res) => {
  try {
    const check = await cQ.find();

    console.log(check);
    if (check.length > 0) {
      const updatedQArray = await cQ.findOne().where(check[0]._id);
      console.log("NEW Q in Display:", updatedQArray);
      res.json(updatedQArray);
    } else {
      res.json([]);
    }
    // res.json({ error: true });
    /*
    const questions = await cQ.find();
    if (questions) {
      console.log("QUESTIONS: ", questions);
      res.json({ data: questions });
      /res.json([
        { question: "Age?", answer: "" },
        { question: "Experience?", answer: "" },
        { question: "Hobbies?", answer: "" },
      ]);
    } else {
      res.json([{}]);
    }*/
  } catch (err) {
    console.log(err);
  }

  /*custom q:

  Software Development Experience (1/2/3/4/5) [How much do you know about software development?]
  */
};
const updateDuesPaid = async (req, res) => {
  const token = req.cookies.access_token;
  // console.log("TOKEN IN FTQ:  ", token);
  const decodedToken = jwt.decode(token);

  const updatedDuesMember = await clubMember
    .findOneAndUpdate({
      paidDues: true,
    })
    .where(decodedToken._id);

  console.log(updatedDuesMember);

  res.redirect(301, "http://localhost:3003/pay/Dues/Stripe");
};

const checkPaid = async (req, res) => {
  console.log(req);
  try {
    console.log("REQ QUERY:", req.query);
    //const decodedToken = jwt.decode(req.cookies.access_token);
    const decodedToken =
      jwt.decode(req.query.token) || jwt.decode(req.cookies.access_token);
    console.log("DECODED TOKEN:", decodedToken);
    const updatedDuesMember = await clubMember
      .findOneAndUpdate({
        paidDues: true,
      })
      .where(decodedToken._id);
    console.log(updatedDuesMember);

    console.log(("IS IT TRUE?", updatedDuesMember.paidDues));
    res.json({ paidDues: updatedDuesMember.paidDues });
  } catch (err) {
    console.log(err);
    res.json({ paidDues: false });
  }
};
const updateCQForm = async (req, res) => {
  console.log("UPDATECGFROM");
  console.log(req.query.q);
  const newQ = req.query.q;
  const check = await cQ.find();
  console.log(check);
  if (check.length > 0) {
    const updatedQArray = await cQ
      .findOneAndUpdate({
        $push: {
          customquestion: { question: newQ, answer: "" },
        },
      })
      .where(check[0]._id);
    console.log("NEW Q:", updatedQArray);
  } else {
    const data = new cQ({
      question: newQ,
      answer: "",
    });
    data.save();
  }
};

const displayCustomQ = async (req, res) => {
  const check = await cQ.find();

  console.log(check);
  if (check.length > 0) {
    const updatedQArray = await cQ.findOne().where(check[0]._id);
    console.log("NEW Q in Display:", updatedQArray);
    res.json(updatedQArray);
  } else {
    res.json([]);
  }
  // res.json([{ question: "How are you?" }]);
};
const deleteCustomQ = async (req, res) => {
  const check = await cQ.find();
  // const questionID = req.query;
  const documentID = check[0]._id;
  const itemIdToRemove = req.query.qID;
  const itemId = new mongoose.Types.ObjectId(itemIdToRemove);
  const filter = { _id: documentID };
  const update = {
    $pull: { customquestion: { _id: itemId } },
  };
  cQ.updateOne(filter, update)
    .then(async (result) => {
      console.log(result);
      const updatedQArray = await cQ.findOne().where(check[0]._id);
      console.log("NEW Q in Display:", updatedQArray);
      res.json(updatedQArray);
      // Handle success
    })
    .catch((error) => {
      console.error("Update error:", error);
      // Handle update error
    });
  console.log("qid IN DELETE:", itemIdToRemove);
  console.log("iN dELETE:", check);
};

const updateAnswers = async (req, res) => {
  //res.json({ msg: true });
  console.log("UPDATE ANSWER", req.query.submit);
  const answerArray = req.query.submit;
  console.log("UPDATE ANSWER", req.query.token);

  const user = await clubMember
    .findOneAndUpdate({
      $push: {
        customQ: answerArray,
      },
    })
    .where(req.query.token._id);
  console.log(user);

  res.json({ msg: user });
};

const lendUser = async (req, res) => {
  console.log(req);
  console.log(req.query.UID);
  try {
    const user = await clubMember.findOne().where(req.query.id);
    res.json({ msg: user });
  } catch (err) {
    console.log(err);
    res.json({ msg: true });
  }
};

const takeGeneral = async (req, res, next) => {
  try {
    const UID = req.query.UID;
    const f_name = req.query.f_name;
    const surname = req.query.surname;
    const email = req.query.email;
    const NID = req.query.NID;
    const Gender = req.query.Gender;
    const major = req.query.major;
    const classStanding = req.query.classStanding;

    const user = clubMember.create({
      UID,
      f_name,
      surname,
      email,
      NID,
      Gender,
      major,
      classStanding,
      paidDues: false,
      customQ: [],
    });

    (await user).save();

    if (clubMember.find()) {
      console.log("Addded");
    }
  } catch (err) {
    console.log(err);
  }
};

const findDuesPayingMembers = async (req, res) => {
  try {
    clubMember
      .find({ paidDues: true })
      .then((users) => res.json(users))
      .catch((err) => res.json(err));
  } catch (err) {
    console.log(err);
  }
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
  retrieveCustomQ,
  updateCQForm,
  displayCustomQ,
  deleteCustomQ,
  updateAnswers,
  lendUser,
  takeGeneral,
  updateDuesPaid,
  checkPaid,
  findDuesPayingMembers,
};
