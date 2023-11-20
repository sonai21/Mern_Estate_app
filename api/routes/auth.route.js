const express = require("express");
const {
  signup,
  signin,
  google,
  signOut,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signOut);

module.exports = router;
