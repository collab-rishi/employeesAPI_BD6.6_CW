let { DataTypes, sequelize } = require("../lib/");

let agent = sequelize.define("agent", {
  agentId: {
    type: DataTypes.INTEGER,
    // primaryKey: true,
    // autoIncrement: true,
  },
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = {
  agent,
};

// { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
// { agentId: 2, name: 'Dave', email: 'dave@example.com' },
