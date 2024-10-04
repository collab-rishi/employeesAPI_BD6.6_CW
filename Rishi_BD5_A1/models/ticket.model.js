let { DataTypes, sequelize } = require("../lib");
let { customer } = require("./customer.model");
let { agent } = require("./agent.model");

let ticket = sequelize.define("ticket", {
  ticketId: {
    type: DataTypes.INTEGER,
    // primaryKey: true,
    // autoIncrement: true,
  },
  title: DataTypes.TEXT,
  description: DataTypes.TEXT,
  status: DataTypes.TEXT,
  priority: DataTypes.INTEGER,
  customerId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: customer,
    //   key: "id",
    // },
  },
  agentId: {
    type: DataTypes.INTEGER,
    // references: {
    //   model: agent,
    //   key: "id",
    // },
  },
});

module.exports = { ticket };

// ticketId: 1,
//   title: 'Login Issue',
//   description: 'Cannot login to account',
//   status: 'open',
//   priority: 1,
//   customerId: 1,
//   agentId: 1,

// name: DataTypes.TEXT,
//  genre: DataTypes.TEXT,
//  release_year: DataTypes.INTEGER,
//  artist: DataTypes.TEXT,
//  album: DataTypes.TEXT,
//  duration: DataTypes.INTEGER,
