"use strict";

const auth = require("basic-auth");
const bycrpt = require("bcryptjs");
const { User } = require("../models");

exports.authenticateUser = async (req, res, next) => {
  const crediential = auth(req);
  let message;
  if (crediential) {
    const user = await User.findOne({
      where: { emailAddress: crediential.name },
    });
    if (user) {
      let authed = bycrpt.compareSync(crediential.pass, user.password);
      if (authed) {
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `No user found with email address: ${crediential.name}`;
    }
  } else {
    message = "Auth header not found!";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied!" });
  } else {
    next();
  }
};
