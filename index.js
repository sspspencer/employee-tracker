const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employees",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to employees database!");

  initalPrompt();
});

// First Prompt for User with choices of what they want to do
function initalPrompt() {
  return (
    inquirer
      .prompt({
        type: "list",
        name: "task",
        message: "Would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "End",
        ],
      })
      // switch statement to call functions to execute tasks chosen
      .then(function ({ task }) {
        switch (task) {
          case "View All Employees":
            viewAllEmployees();
            break;

          case "Add Employee":
            AddEmployeePrompt();
            break;

          case "Update Employee Role":
            updatePrompt();
            break;

          case "View All Roles":
            viewAllRoles();
            break;

          case "Add Role":
            addRolePrompt();
            break;

          case "View All Departments":
            viewAllDepartments();
            break;

          case "Add Department":
            addDepPrompt();
            break;

          case "End":
            console.log("See You Soon!");
            connection.end();
            break;
        }
      })
  );
}
