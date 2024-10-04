const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());





app.get("/employees", (req, res) => {

  const employees = getAllEmployees();
  res.json({ employees });

});


app.get("/employees/details/:id", (req, res) => {

  let employee = getEmployeeById(req.params.id);
  
  res.json({ 
    employees 
  });

});


module.exports = { app };



