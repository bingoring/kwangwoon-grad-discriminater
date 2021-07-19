const express = require("express");
const router = express.Router();
const index = require("./index.controller");

router.get("/", index.demo);
module.exports = router;