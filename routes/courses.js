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

module.exports = router;
