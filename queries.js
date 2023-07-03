//Imports config 
const config = require('config.js');

//Sets up database connection configuration
const Pool = require('pg').Pool
const pool = new Pool({
  user: config.databaseUser,
  host: config.databaseHost,
  database: config.database,
  password: config.databasePassword,
  port: config.databasePort,
})