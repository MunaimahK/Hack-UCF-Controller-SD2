const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const clubMember = new mongoose.Schema(
  {
    UID: String,
    f_name: { type: String, default: "" },
    surname: { type: String, default: "" },
    email: { type: String, default: "" },
    NID: { type: String, default: "" },
    Gender: { type: String, default: "" },
    major: { type: String, default: "" },
    classStanding: { type: String, default: "" },
    paidDues: Boolean,
    customQ: [
      {
        question: String,
        answer: String,
      },
    ],
  },
  {
    collection: "members",
  }
);
// GENERAL Q's:
// First Name
// Surname
// email
// NID

// Custom Q's HACK@UCF:
// Returning YES/NO
// MINECRAFT
// gender
// major
// class standing
// shirt size

// collection specifies where the schema is inserted
// bu default uses users collection in Mongo
// Specified to main collection inside of the iNflux-main DB

const Member = mongoose.model("clubMember", clubMember);
module.exports = Member;
