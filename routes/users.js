const express = require("express");
const { User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

// GET "/api/users" route

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

// POST "/api/users" route

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    try {
      await User.create(req.body);
      res.status(201).location("/").end();
    } catch (err) {
      if (
        err.name === "SequelizeValidationError" ||
        "SequelizeUniqueConstraintError"
      ) {
        const errors = err.errors.map((e) => e.message);
        res.status(400).json({
          "Validation Errors": errors,
        });
      } else {
        next(err);
      }
    }
  })
);

module.exports = router;
