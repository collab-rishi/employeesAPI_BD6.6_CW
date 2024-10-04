let { DataTypes, sequelize } = require("../lib");

let customer = sequelize.define("customer", {
  customerId: {
    type: DataTypes.INTEGER,
    // primaryKey: true,
    // autoIncrement: true,
  } , 
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = { customer };

// { customerId: 1, name: 'Alice', email: 'alice@example.com' },
// { customerId: 2, name: 'Bob', email: 'bob@example.com' },

// name: DataTypes.TEXT,
//  genre: DataTypes.TEXT,
//  release_year: DataTypes.INTEGER,
//  artist: DataTypes.TEXT,
//  album: DataTypes.TEXT,
//  duration: DataTypes.INTEGER,
