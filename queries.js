//Imports config 
const {config} = require('./config.js');

//Imports required modules
const pgp = require('pg-promise')();

//Sets up database connection
const db = pgp({
    user: config.databaseUser,
    host: config.databaseHost,
    database: config.database,
    password: config.databasePassword,
    port: config.databasePort,
  })

module.exports = {db};