const express = require("express");
const { User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    try {
      User.create(req.body);
      res.status(201).end();
    } catch (error) {}
  })
);

module.exports = router;
