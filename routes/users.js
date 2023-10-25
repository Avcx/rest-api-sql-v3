const express = require("express");
const { User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const users = await User.findAll();
    res.json([users]);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {})
);

module.exports = router;
