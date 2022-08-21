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
// function to view all employee's in the database
const viewAllEmployees = () => {
  const sql = `SELECT employee.first_name, employee.last_name,
            role.title AS title, role.salary AS salary,
            department.name AS department, employee.manager
            FROM employee
            LEFT JOIN role ON
            employee.role_id = role.id
            LEFT JOIN department ON
            role.department_id = department.id;`;
  connection.query(sql, (err, rows) => {
    console.table(rows);
  });
  initalPrompt();
};

const AddEmployeePrompt = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter the first name of the employee!",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the last name of the employee!",
      },
      {
        type: "input",
        name: "role",
        message: "Please enter the role ID of this employee!",
      },
      {
        type: "confirm",
        name: "manager",
        message: "Is the employee a manager?",
        default: false,
      },
    ])
    .then((employeeData) => inquirerManager(employeeData));
};

const inquirerManager = (employeeData) => {
  if (employeeData.manager) {
    inquirer
      .prompt({
        type: "input",
        name: "managerId",
        message: "Please Provide the Name of their Manager!",
      })
      .then(({ managerId }) => addEmployee(parseInt(managerId), employeeData));
    return;
  }
  addEmployee("NULL", employeeData);
};
// function to add a new Employee
const addEmployee = (managerId, employee) => {
  delete employee.manager;
  employee.managerId = managerId;
  employee.role = parseInt(employee.role);
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager) VALUES
        ('${employee.firstName}', '${employee.lastName}', '${employee.role}', '${employee.managerId}')`;
  connection.query(sql, (err, row) => {
    console.log("Added Employee");
    console.table(employee);
  });
  initalPrompt();
};

// Prompt to get information needed to update an employee's role
const updatePrompt = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee",
        message:
          "Please provide the ID of the employee you would like to update!",
      },
      {
        type: "input",
        name: "role",
        message:
          "please provide the ID of the role you would like to re-assign to this employee!",
      },
    ])
    .then((updateData) => updateEmployeeRole(updateData));
};

// function to update the employee's role
const updateEmployeeRole = (updateData) => {
  const sql = `UPDATE employee
        SET role_id = ${parseInt(updateData.role)}
        WHERE id = ${parseInt(updateData.employee)};`;
  connection.query(sql, (err, row) => {
    console.log("Updated employee");
    if (err) {
      console.log(err);
    }
  });
  initalPrompt();
};

// funtion to view all possible Employee roles
const viewAllRoles = () => {
  const sql = `Select role.title, department.name AS department, role.salary
            FROM role 
            LEFT JOIN department ON
            role.department_id = department.id;`;
  connection.query(sql, (err, rows) => {
    console.table(rows);
  });
  initalPrompt();
};

// Prompt for information to add a new role
const addRolePrompt = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "title",
        message:
          "Please provide a title for the New Role you would like to add!",
      },
      {
        type: "input",
        name: "salary",
        message: "Please provide a Salary for this Role!",
      },
      {
        type: "input",
        name: "departmentId",
        message: "Please provide the department ID this role would be in!",
      },
    ])
    .then((rollData) => addRole(rollData));
};

// function to add new role
const addRole = (rollData) => {
  const sql = `INSERT INTO role (title, salary, department_id) 
        VALUES ('${rollData.title}',
        '${parseInt(rollData.salary)}',
        '${parseInt(rollData.departmentId)}');`;
  connection.query(sql, (err, row) => {
    console.log("Added New Role");
  });
  initalPrompt();
};

// function to view all departments
const viewAllDepartments = () => {
  const sql = `SELECT * FROM department;`;
  connection.query(sql, (err, rows) => {
    console.table(rows);
  });
  initalPrompt();
};

// prompt to get information to add a new department
const addDepPrompt = () => {
  inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "Please provide a name for the new Department!",
    })
    .then(({ departmentData }) => addDepartment(departmentData));
};

// funtion to add new department to database
const addDepartment = (departmentData) => {
  const sql = `INSERT INTO department (name) VALUES ('${departmentData}')`;
  connection.query(sql, (err, row) => {
    console.log("Added Department");
  });
  initalPrompt();
};
