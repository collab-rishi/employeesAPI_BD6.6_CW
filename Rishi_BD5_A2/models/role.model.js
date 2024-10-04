// { title: 'Software Engineer' },
// { title: 'Marketing Specialist' },
// { title: 'Product Manager' },

let { DataTypes, sequelize } = require("../lib/");

let role = sequelize.define("role", {

  title: DataTypes.TEXT
});

module.exports = {
  role,
};

// { agentId: 1, name: 'Charlie', email: 'charlie@example.com' },
// { agentId: 2, name: 'Dave', email: 'dave@example.com' },
