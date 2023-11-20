const express = require("express");
const createListing = require("../controllers/listing.controller.js");
const verifyToken = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/create", verifyToken, createListing);

module.exports = router;
