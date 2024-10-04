let { DataTypes, sequelize } = require("../lib");
let { customer } = require("./customer.model");
let { agent } = require("./agent.model");
const { ticket } = require("./ticket.model");

let ticketAgent = sequelize.define("ticketAgent", {
  ticketId: {
    type: DataTypes.INTEGER,
    references: {
      model: ticket,
      key: "id",
    },
    allowNull: false,
  },

  agentId: {
    type: DataTypes.INTEGER,
    references: {
      model: agent,
      key: "id",
    },
    allowNull: false,
  },
});

ticket.belongsToMany(agent, { through: ticketAgent });
agent.belongsToMany(ticket, { through: ticketAgent });

// { ticketId: tickets[0].id, agentId: agents[0].id },
// { ticketId: tickets[2].id, agentId: agents[0].id },
// { ticketId: tickets[1].id, agentId: agents[1].id },

module.exports = { ticketAgent };
