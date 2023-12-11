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
            msg: "Please provide first name!",
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
            msg: "Please provide a last name!",
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
            msg: "Please provide a properly formated email address!",
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
            msg: "Please provide a password!",
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
