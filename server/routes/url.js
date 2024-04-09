const express = require("express");
const {
  generateNewShortUrl,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", generateNewShortUrl);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;