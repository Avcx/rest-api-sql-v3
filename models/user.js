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
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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
    });
  };
  return User;
};
