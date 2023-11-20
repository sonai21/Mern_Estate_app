const Listing = require("../models/listing.model.js");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = createListing;
