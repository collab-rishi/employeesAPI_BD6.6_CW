let express = require("express");

let { sequelize } = require("./lib/index");
const { parse } = require("querystring");
const { department } = require("./models/department.model");
const { employee } = require("./models/employee.model");
const { role } = require("./models/role.model");
const { employeeDepartment } = require("./models/employeeDepartment.model");
const { employeeRole } = require("./models/employeeRole.model");
let { Op } = require("@sequelize/core");
let app = express();

app.use(express.json());




// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await employeeDepartment.findAll({
    where: { employeeId },
  });

  let departmentData;
  for (let empDep of employeeDepartments) {
    departmentData = await department.findOne({
      where: { id: empDep.departmentId },
    });
  }

  return departmentData;
}


async function getEmployeeRoles(employeeId) {
  const employeeRoles = await employeeRole.findAll({
    where: { employeeId },
  });

  let roleData;
  for (let empRol of employeeRoles) {
    roleData = await role.findOne({
      where: { id: empRol.roleId },
    });
  }

  return roleData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}




// Endpoint to seed database
app.get('/seed_db', async (req, res) => {
  await sequelize.sync({ force: true });

  const departments = await department.bulkCreate([
    { name: 'Engineering' },
    { name: 'Marketing' },
  ]);

  const roles = await role.bulkCreate([
    { title: 'Software Engineer' },
    { title: 'Marketing Specialist' },
    { title: 'Product Manager' },
  ]);

  const employees = await employee.bulkCreate([
    { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
    { name: 'Priya Singh', email: 'priya.singh@example.com' },
    { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
  ]);

  // Associate employees with departments and roles using create method on junction models
  await employeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await employeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await employeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await employeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: 'Database seeded!' });
});

app.get("/test", (req, res) => {
  res.send("Hello from Rishi's BD5 A2");
})


async function getAllEmployees() {
  let employees = await employee.findAll();
  let employeeRecords = [];

  for (let i = 0; i < employees.length; i++) {
    let employeeDetails = await getEmployeeDetails(employees[i]);
    employeeRecords.push(employeeDetails);
    // ticketRecords.push(tickets[i].ticket);
  }

  return { employees: employeeRecords };
}




app.get("/employees", async (req, res) => {
  try {
    let response = await getAllEmployees();

    if (response.employees.length === 0) {
      return res.status(404).json({ message: "No employees found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getEmployeesById(id) {
  let employees = await employee.findOne({ where: { id } });
  // let ticketRecords = [];

  // for(let i = 0; i < tickets.length; i++) {
  let employeeDetails = await getEmployeeDetails(employees);
  // ticketRecords.push(ticketDetails);
  // ticketRecords.push(tickets[i].ticket);
  // }

  return { employee: employeeDetails };
}

app.get("/employees/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let response = await getEmployeesById(id);

    if (response.employee === null) {
      return res.status(404).json({ message: "No employee found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


async function getEmployeesByDepartment(departmentId) {
  let employeeDepartments = await employeeDepartment.findAll({ where: { departmentId } });

  
  let employeeRecords = [];

  for(let emp of employeeDepartments) {
    let employeeData = await employee.findOne({ 
      where: { id: emp.employeeId },
    });
    if (employeeData) {
      let employeeDetails = await getEmployeeDetails(employeeData);
      employeeRecords.push(employeeDetails);
      }
  }
  // roleData = await role.findOne({
  //   where: { id: empRol.roleId },
  // });
  

  return { employees: employeeRecords };
}

app.get("/employees/department/:departmentId", async (req, res) => {
  try {
    let departmentId = req.params.departmentId;
    let response = await getEmployeesByDepartment(departmentId);

    if (response.employees === null) {
      return res.status(404).json({ message: "No employee found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



async function getEmployeesByRole(roleId) {
  let employeeRoles = await employeeRole.findAll({ where: { roleId } });


  let employeeRecords = [];

  for(let emp of employeeRoles) {
    let employeeData = await employee.findOne({ 
      where: { id: emp.employeeId },
    });
    if (employeeData) {
      let employeeDetails = await getEmployeeDetails(employeeData);
      employeeRecords.push(employeeDetails);
      }
  }
  // roleData = await role.findOne({
  //   where: { id: empRol.roleId },
  // });


  return { employees: employeeRecords };
}

app.get("/employees/role/:roleId", async (req, res) => {
  try {
    let roleId = req.params.roleId;
    let response = await getEmployeesByRole(roleId);

    if (response.employees === null) {
      return res.status(404).json({ message: "No employee found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



 

async function getEmployeesSortedByName(order) {
  let employees = await employee.findAll({
    order: [["name", order]],
  });

  let employeeRecords = [];

  for (let i = 0; i < employees.length; i++) {
    let employeeDetails = await getEmployeeDetails(employees[i]);
      employeeRecords.push(employeeDetails);
    // ticketRecords.push(tickets[i].ticket);
  }

  return { employees: employeeRecords };
}

app.get("/employees/sort-by-name", async (req, res) => {
  try {

    let order = req.query.order;
    
    let response = await getEmployeesSortedByName(order);

    if (response.employees.length === 0) {
      return res.status(404).json({ message: "No tickets found." });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function addNewEmployee(newEmployee) {
  console.log("4");
  let newData = await employee.create(newEmployee);
  console.log("5");

  let newDep = await employeeDepartment.create({

    employeeId: newData.id,
    departmentId: newEmployee.departmentId,
  });
  console.log("6");
  let newRol = await employeeRole.create({
    employeeId: newData.id,
    roleId: newEmployee.roleId,
  });
  console.log("7");

  let employeeDetails = await getEmployeeDetails(newData);
  console.log("8");
  

  return { employee: employeeDetails };
}

app.post("/employees/new", async (req, res) => {
  try {
    console.log("1");
    let newEmployee = req.body;
    console.log("2");
    let response = await addNewEmployee(newEmployee);
    console.log("3");

    if (!newEmployee) {
      return res.status(400).json({ message: "New employee is required." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



async function updateEmployeeDetails(employeeData, id) {
  let employeeDetails = await employee.findOne({ where: { id } });

  if (!employeeDetails) {
    return {};
  }
  console.log(employeeDetails);

  if (employeeData.name) employeeDetails.name = employeeData.name;
  if (employeeData.email) employeeDetails.email = employeeData.email;

  

  if (employeeData.departmentId) {
    await employeeDepartment.destroy({
      where: {
        employeeId: parseInt(employeeDetails.id),
      },
    });
    await employeeDepartment.create({
      employeeId: employeeDetails.id,
      departmentId: employeeData.departmentId,
    });
  }


  if (employeeRole.roleId) {
    await employeeRole.destroy({
      where: {
        employeeId: parseInt(employeeDetails.id),
      },
    });
    await employeeRole.create({
      employeeId: employeeDetails.id,
      roleId: employeeData.roleId,
    });
  }

  employeeDetails.set(employeeData);


  
  
  let updatedData = await employeeDetails.save();

  let result = await getEmployeeDetails(updatedData);

  return { employee: result };

  // return { message: "Employee Data updated successfully", updatedData };

  //  let

  // let ticketRecords = [];

  // for(let i = 0; i < tickets.length; i++) {
  // let ticketDetails = await getTicketDetails(newData);
  // ticketRecords.push(ticketDetails);
  //    // ticketRecords.push(tickets[i].ticket);
  //  }

  // return { ticket: ticketDetails} ;
}

app.post("/employees/update/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let employeeData = req.body;

    let response = await updateEmployeeDetails(employeeData, id);

    if (!employeeData) {
      return res.status(400).json({ message: "New employee data is required." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




async function deleteEmployee(id) {

  await employeeDepartment.destroy({ where: { employeeId: id } });
  await employeeRole.destroy({ where: { employeeId: id } });

  
  let destroyedEmployee = await employee.destroy({ where: { id } });
   

  if (destroyedEmployee === 0) {
    return {};
  }

  return { message: "Employee with ID: " + id + " deleted successfully" };
}

//  let

// let ticketRecords = [];

// for(let i = 0; i < tickets.length; i++) {
// let ticketDetails = await getTicketDetails(newData);
// ticketRecords.push(ticketDetails);
//     ticketRecords.push(tickets[i].ticket);
//  }

// return { ticket: ticketDetails} ;

app.post("/employees/delete", async (req, res) => {
  try {
    let id = parseInt(req.body.id);

    let response = await deleteEmployee(id);

    if (!response.message) {
      return res.status(404).json({ message: "Employee not found." });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

















app.listen(3000, () => {
  console.log("Server is running on port 3000");
});





