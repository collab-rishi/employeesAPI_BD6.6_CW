// { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
// { name: 'Priya Singh', email: 'priya.singh@example.com' },
// { name: 'Ankit Verma', email: 'ankit.verma@example.com' },


let { DataTypes, sequelize } = require("../lib/");

let employee = sequelize.define("employee", {
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

module.exports = {
  employee,
};

// { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
// { agentId: 2, name: 'Dave', email: 'dave@example.com' },
