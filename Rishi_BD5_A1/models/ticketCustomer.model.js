let {DataTypes, sequelize} = require("../lib")
let {customer} = require("./customer.model")
// let {agent} = require("./agent.model")
let {ticket} = require("./ticket.model")


let ticketCustomer = sequelize.define("ticketCustomer", {

    ticketId: {
      type:DataTypes.INTEGER,
      references: {
        model: ticket,
        key: "id"
      },
      allowNull: false,
    },

    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: customer,
        key: "id",
      },
      allowNull: false,
    },
  }); 



customer.belongsToMany(ticket, { through: ticketCustomer });
ticket.belongsToMany(customer, { through: ticketCustomer });


// { ticketId: tickets[0].id, customerId: customers[0].id },
// { ticketId: tickets[2].id, customerId: customers[0].id },
// { ticketId: tickets[1].id, customerId: customers[1].id },

module.exports = { ticketCustomer };












