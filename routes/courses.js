const express = require("express");
const { Course, User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.json(courses);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    try {
      await Course.create(req.body);
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

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      include: [
        {
          model: User,
        },
      ],
    });
    res.json(course);
  })
);

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {})
);

router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {})
);

module.exports = router;
