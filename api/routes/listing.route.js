const express = require("express");
const {
  createListing,
  deleteListing,
} = require("../controllers/listing.controller.js");
const verifyToken = require("../utils/verifyUser.js");

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
module.exports = router;
