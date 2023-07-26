//This file contains database services that manipulate the database in some way
//They are kept separate not only to reuse, but also to separate functionality
//They are generic and can be used dynamically on any table by multiple modules for multiple purposes
//They are paramaterized and dynamic table/column names are escaped to avoid SQL injection 
//If the data storage method is changed, these functions can be refactored to return the same results without affecting the rest of the server and allowing it to continue functioning as normal
//All error processing will be done in services and thrown to catch in middleware

//Imports necessary modules
const {db} = require('../queries.js');
const {processQueryErr} = require('../utilities/database-utilities.js');

//Sets node pg to store the date without time
const pg = require('pg');
pg.types.setTypeParser(1082, function(stringValue){
    return stringValue;
  });

//Returns an array of all entries from a table
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const getAllEntries = (tableName, context) => {
    if(!context){
        context = db;
    }
    //Queries the database to get all entries and returns the result
    return context.any('SELECT * FROM $1:name', [
        tableName
    ]).catch(err => processQueryErr(err));
};

//Finds and returns the entry by id from a table
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const getEntryById = (entryId, tableName, context) => {
    if(!context){
        context = db;
    }
    //Queries the database to get the entry and returns the result
    return context.one('SELECT * FROM $1:name WHERE id = $2', [
        tableName, 
        entryId
    ]).catch(err => processQueryErr(err));
};

//Finds and returns the entries from a table that match a value in a column
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const getMatchingEntries = (tableName, column, value, context) => {
    if(!context){
        context = db;
    }
    //Queries the database to get the matching entries and returns the result
    return context.any('SELECT * FROM $1:name WHERE $2:name = $3', [
        tableName, 
        column, 
        value
    ]).catch(err => processQueryErr(err));
};

//Adds an entry to a table and returns the entry along with the newly assigned v4 UUID
//Uses the properties of the entry object to create a custom query statement
//Entry must begin with an undefined id property which will be assigned by the query
//Entry properties must match the columns of a table
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const addEntry = async (entry, tableName, context) => {
    if(!context){
        context = db;
    }
    //Uses the entry object to create arrays containing the columns and values to add
    let columnsArray = Object.getOwnPropertyNames(entry);
    columnsArray = columnsArray.slice(1);
    let valuesArray = Object.values(entry);
    valuesArray = valuesArray.slice(1);   
    //Queries the database to add the entry and returns the result
    return context.one("INSERT INTO ${table:name} (${columns:name}) VALUES (${values:csv}) RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray
    }).catch(err => processQueryErr(err));
};

//Updates the entry by id in a table
//Entry must be an object that begins with an id property
//Entry properties must match the columns of the table
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const updateEntry = (entryId, entry, tableName, context) => {
    if(!context){
        context = db;
    }
    //Uses the entry object to create arrays containing the columns and values to update
    let columnsArray = Object.getOwnPropertyNames(entry);
    let valuesArray = Object.values(entry);
    //Queries the database to update the entry and returns the result
    return context.one('UPDATE ${table:name} SET (${columns:name}) = (${values:csv}) WHERE id = ${id:csv} RETURNING *', {
        table: tableName,
        columns: columnsArray,
        values: valuesArray,
        id: entryId
    }).catch(err => processQueryErr(err));
};

//Deletes an entry by id from a table and returns the deleted entry
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const deleteEntry = (entryId, tableName, context) => {
    if(!context){
        context = db;
    }
    //Queries the database to delete the entry by id and returns the deleted entry
    return context.one('DELETE FROM ${table:name} WHERE id = ${id:csv} RETURNING *', {
        table: tableName,
        id: entryId
    }).catch(err => processQueryErr(err));
}; 

//Adds an amount to a column of an entry from a table
//Column must be numeric or it will error
//Context is an optional argument that must be included if the function is used in a transaction batch, generally t passed in with a tx callback
const addToColumn = (tableName, columnName, entryId, amountToAdd, context) => {
    if(!context){
        context = db;
    }
    // Queries the database to add to the column of the entry and returns the result
    return context.one('UPDATE ${table:name} SET ${column:name} = ${column:name} + ${amount:csv} WHERE id = ${id:csv} RETURNING *', {
        table: tableName,
        column: columnName,
        amount: amountToAdd,
        id: entryId
    }).catch(err => processQueryErr(err));
};

//Exports functions to be used in other modules
module.exports = {
    getAllEntries,
    getEntryById,
    getMatchingEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    addToColumn
};
