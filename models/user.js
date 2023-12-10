"use strict";
const { Model } = require("sequelize");
const bycrpt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}
  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "'firstName' cannot be an empty string!",
          },
          notNull: {
            msg: "Please provide a value for 'firstName'!",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "'lastName' cannot be an empty string!",
          },
          notNull: {
            msg: "Please provide a value for 'lastName'!",
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "'emailAddress' must recieve a properly formated email address!",
          },
          notNull: {
            msg: "Please provide a value for 'emailAddress'",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "'password' cannot be an empty string!",
          },
          notNull: {
            msg: "Please provide a value for 'password'!",
          },
        },
        set(val) {
          let hashedPass = bycrpt.hashSync(val, 10);
          this.setDataValue("password", hashedPass);
        },
      },
    },
    { sequelize }
  );
  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
      as: "owner",
    });
  };
  return User;
};
