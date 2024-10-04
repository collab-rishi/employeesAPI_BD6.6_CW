let express = require("express");

let { sequelize } = require("./lib/index");
const { parse } = require("querystring");
const { ticket } = require("./models/ticket.model");
const { customer } = require("./models/customer.model");
const { agent } = require("./models/agent.model");
const { ticketCustomer } = require("./models/ticketCustomer.model");
const { ticketAgent } = require("./models/ticketAgent.model");
let { Op } = require("@sequelize/core");
let app = express();

app.use(express.json());

//getTicketCustomers(ticketId), getTicketAgents(ticketId), getTicketDetails(ticketData)

// async function getTicketCustomers(ticketId) {}

// async function getTicketAgents(ticketId) {}

// async function getTicketDetails(ticketData) {}

// Helper function to get ticket's associated customers
async function getTicketCustomers(ticketId) {
  const ticketCustomers = await ticketCustomer.findAll({
    where: { ticketId },
  });

  let customerData;
  for (let cus of ticketCustomers) {
    customerData = await customer.findOne({
      where: { customerId: cus.customerId },
    });
  }

  return customerData;
}

async function getTicketAgents(ticketId) {
  const ticketAgents = await ticketAgent.findAll({
    where: { ticketId },
  });

  let agentData;
  for (let ags of ticketAgents) {
    agentData = await agent.findOne({ where: { agentId: ags.agentId } });
  }

  return agentData;
}

// Helper function to get ticket details with associated customers and agents
async function getTicketDetails(ticketData) {
  const customer = await getTicketCustomers(ticketData.id);
  const agent = await getTicketAgents(ticketData.id);

  return {
    ...ticketData.dataValues,
    customer,
    agent,
  };
}

app.get("/test", (req, res) => {
  res.send("helloo");
});

app.get("/seed_db", async (req, res) => {
  await sequelize.sync({ force: true });

  let tickets = await ticket.bulkCreate([
    {
      ticketId: 1,
      title: "Login Issue",
      description: "Cannot login to account",
      status: "open",
      priority: 1,
      customerId: 1,
      agentId: 1,
    },
    {
      ticketId: 2,
      title: "Payment Failure",
      description: "Payment not processed",
      status: "closed",
      priority: 2,
      customerId: 2,
      agentId: 2,
    },
    {
      ticketId: 3,
      title: "Bug Report",
      description: "Found a bug in the system",
      status: "open",
      priority: 3,
      customerId: 1,
      agentId: 1,
    },
  ]);

  let customers = await customer.bulkCreate([
    { customerId: 1, name: "Alice", email: "alice@example.com" },
    { customerId: 2, name: "Bob", email: "bob@example.com" },
  ]);

  let agents = await agent.bulkCreate([
    { agentId: 1, name: "Charlie", email: "charlie@example.com" },
    { agentId: 2, name: "Dave", email: "dave@example.com" },
  ]);

  await ticketCustomer.bulkCreate([
    { ticketId: tickets[0].id, customerId: customers[0].id },
    { ticketId: tickets[2].id, customerId: customers[0].id },
    { ticketId: tickets[1].id, customerId: customers[1].id },
  ]);

  await ticketAgent.bulkCreate([
    { ticketId: tickets[0].id, agentId: agents[0].id },
    { ticketId: tickets[2].id, agentId: agents[0].id },
    { ticketId: tickets[1].id, agentId: agents[1].id },
  ]);

  return res.json({ message: "Database seeded successfully" });
});

async function getAllTickets() {
  let tickets = await ticket.findAll();
  let ticketRecords = [];

  for (let i = 0; i < tickets.length; i++) {
    let ticketDetails = await getTicketDetails(tickets[i]);
    ticketRecords.push(ticketDetails);
    // ticketRecords.push(tickets[i].ticket);
  }

  return { tickets: ticketRecords };
}

app.get("/tickets", async (req, res) => {
  try {
    let response = await getAllTickets();

    if (response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getTicketsById(id) {
  let tickets = await ticket.findOne({ where: { id } });
  // let ticketRecords = [];

  // for(let i = 0; i < tickets.length; i++) {
  let ticketDetails = await getTicketDetails(tickets);
  // ticketRecords.push(ticketDetails);
  // ticketRecords.push(tickets[i].ticket);
  // }

  return { ticket: ticketDetails };
}

app.get("/tickets/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let response = await getTicketsById(id);

    if (response.ticket === null) {
      return res.status(404).json({ message: "No tickets found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getTicketsByStatus(status) {
  let tickets = await ticket.findAll({ where: { status } });
  let ticketRecords = [];

  for (let i = 0; i < tickets.length; i++) {
    let ticketDetails = await getTicketDetails(tickets[i]);
    ticketRecords.push(ticketDetails);
    // ticketRecords.push(tickets[i].ticket);
  }

  return { tickets: ticketRecords };
}

app.get("/tickets/status/:status", async (req, res) => {
  try {
    let status = req.params.status;
    let response = await getTicketsByStatus(status);

    if (response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getTicketsSortedByPriority() {
  let tickets = await ticket.findAll({
    order: [["priority", "ASC"]],
  });

  let ticketRecords = [];

  for (let i = 0; i < tickets.length; i++) {
    let ticketDetails = await getTicketDetails(tickets[i]);
    ticketRecords.push(ticketDetails);
    // ticketRecords.push(tickets[i].ticket);
  }

  return { tickets: ticketRecords };
}

app.get("/tickets/sort-by-priority", async (req, res) => {
  try {
    // let status = req.params.status;
    let response = await getTicketsSortedByPriority();

    if (response.tickets.length === 0) {
      return res.status(404).json({ message: "No tickets found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addNewTicket(newTicket) {
  let newData = await ticket.create(newTicket);

  let newCu = await ticketCustomer.create({
    ticketId: newData.id,
    customerId: newData.customerId
  });
  let newAg = await ticketAgent.create({
    ticketId: newData.id,
    agentId: newData.agentId,
  });

  //  let

  // let ticketRecords = [];

  // for(let i = 0; i < tickets.length; i++) {
  let ticketDetails = await getTicketDetails(newData);
  // ticketRecords.push(ticketDetails);
  //    // ticketRecords.push(tickets[i].ticket);
  //  }

  return { ticket: ticketDetails };
}

app.post("/tickets/new", async (req, res) => {
  try {
    let newTicket = req.body;
    let response = await addNewTicket(newTicket);

    if (!newTicket) {
      return res.status(400).json({ message: "New ticket data is required." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function updateTicketDetails(updateData, id) {
  let ticketDetails = await ticket.findOne({ where: { id } });

  if (!ticketDetails) {
    return {};
  }

  ticketDetails.set(updateData);
  let updatedTicket = await ticketDetails.save();

  return { message: "Ticket updated successfully", updatedTicket };

  //  let

  // let ticketRecords = [];

  // for(let i = 0; i < tickets.length; i++) {
  // let ticketDetails = await getTicketDetails(newData);
  // ticketRecords.push(ticketDetails);
  //    // ticketRecords.push(tickets[i].ticket);
  //  }

  // return { ticket: ticketDetails} ;
}

app.post("/tickets/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateData = req.body;
    let response = await updateTicketDetails(updateData, id);

    if (!updateData) {
      return res.status(400).json({ message: "New ticket data is required." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function deleteTicket(id) {

  await ticketCustomer.destroy({ where: { ticketId: id } });
  await ticketAgent.destroy({ where: { ticketId: id } });

  
  let destroyedTicket = await ticket.destroy({ where: { id } });

  if (destroyedTicket === 0) {
    return {};
  }

  return { message: "Ticket with ID: " + id + " deleted successfully" };
}

//  let

// let ticketRecords = [];

// for(let i = 0; i < tickets.length; i++) {
// let ticketDetails = await getTicketDetails(newData);
// ticketRecords.push(ticketDetails);
//     ticketRecords.push(tickets[i].ticket);
//  }

// return { ticket: ticketDetails} ;

app.post("/ticket/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);

    let response = await deleteTicket(id);

    if (!response.message) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
