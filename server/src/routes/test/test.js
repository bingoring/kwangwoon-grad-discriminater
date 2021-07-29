const express = require("express");
const router = express.Router();
const index = require("./test.controller");

router.get("/login", index.test);
module.exports = router;