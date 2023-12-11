const express = require("express");
const { Course, User } = require("../models");
const router = express.Router();
const asyncHandler = require("../middleware/asyncHandler");
const { authenticateUser } = require("../middleware/userAuth");

// GET "api/courses" route

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.json(courses).status(200);
  })
);

// POST "api/courses" route

router.post(
  "/",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    try {
      const newCourse = await Course.create({
        ...req.body,
        userId: req.currentUser.id,
      });
      res.status(201).location(`courses/${newCourse.id}`).end();
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

// GET "api/courses/:id" route

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
          as: "owner",
          attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
      ],
    });
    res.json(course);
  })
);

// PUT "api/courses/:id" route

router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === user.id) {
        try {
          await course.update(req.body);
          res.status(204).end();
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
      } else {
        res.status(403).json({
          message: "You do not own this course!",
        });
      }
    } else {
      res.status(400).json({ message: "This course doesn't exist!" });
    }
  })
);

// DELETE "api/courses/:id" route

router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === user.id) {
        await course.destroy();
        res.status(204).end();
      } else {
        res.status(403).json({
          message: "You do not own this course!",
        });
      }
    } else {
      res.status(400).json({ message: "This course doesn't exist!" });
    }
  })
);

module.exports = router;
