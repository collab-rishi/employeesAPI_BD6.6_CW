// await employeeRole.create({
//   employeeId: employees[0].id,
//   roleId: roles[0].id,


let { DataTypes, sequelize } = require("../lib/");
const { role } = require("./role.model");
const { employee } = require("./employee.model");



let employeeRole = sequelize.define("employeeRole", {
  employeeId: {
    type: DataTypes.INTEGER,
    references: {
      model: employee,
      key: "id"
    },
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: {
      model: role,
      key: "id"
    },
    allowNull: false,
  },
 
});

employee.belongsToMany(role, { through: employeeRole });
role.belongsToMany(employee, { through: employeeRole });


module.exports = {
  employeeRole,
};

