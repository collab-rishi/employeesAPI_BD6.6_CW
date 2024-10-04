let sq = require("sequelize");

let sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./Rishi_BD5_A2/database.sqlite",
});

module.exports = { DataTypes: sq.DataTypes, sequelize };
