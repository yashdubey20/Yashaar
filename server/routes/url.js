const express = require("express");
const {
  Newshort,
  Analytics,
} = require("../controllers/url");

const router = express.Router();

router.post("/", Newshort);

router.get("/analytics/:shortId", Analytics);

module.exports = router;