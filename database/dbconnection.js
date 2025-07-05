const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "TestUser",
  password: "Mysql@123",
  database: "etest",
});

module.exports = connection;