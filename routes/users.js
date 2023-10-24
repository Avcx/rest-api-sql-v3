const express = require("express");
const { User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    res.status(200).end();
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {})
);

module.exports = router;
