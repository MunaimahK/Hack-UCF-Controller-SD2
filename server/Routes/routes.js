const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  register,
  login,
  profile,
  display,
  firstTimeQ,
  updateQR,
  defaultAdmin,
  Logout,
  customQ,
} = require("../Controllers/controllers.js");

router.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:3001",
      "localhost:8000",
    ],
    function(origin, callback) {
      // Check if the origin is allowed or if it's a preflight request (OPTIONS)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("https://localhost:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

router.get("/", test);
router.post("/register", register);
router.post("/login", login);
router.get("/profile", profile);
router.get("/member/details", display);
router.get("/one-time-signup-server", firstTimeQ);
router.get("/updateQR", updateQR);
router.get("/admin/default", defaultAdmin);
router.get("/logout", Logout);
router.get("/custom-questions", customQ);
module.exports = router;
