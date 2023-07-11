//This file contains database helper functions that manipulate the database in some way
//They are kept separate not only to reuse, but also to separate functionality
//They are generic and can be used dynamically on any table by multiple modules for multiple purposes
//They are paramaterized and dynamic table/column names are escaped to avoid SQL injection 
//If the data storage method is changed, these functions can be refactored to return the same results without affecting the rest of the server and allowing it to continue functioning as normal

//Imports necessary modules
const {db} = require('../queries.js');

//Returns an array of all entries from a specified table
const getAllEntries = async (tableName) => {
    //Queries the database to return all entries from  the specified table
    let result = await db.query('SELECT * FROM $1:name', [tableName]);
    if(result.length > 0){
        return result;
    //Throws an error if the table is empty
    }else{
        const err = new Error(`Error: there are no entries in ${tableName}.`);
        err.status = 404;
        throw err;
    }
};

//Finds and returns the entry with the specified id from the specified table
const getEntry = async (entryId, tableName) => {
    //Queries the database to find the entry of the specified id and returns the result
    let result = await db.query('SELECT * FROM $1:name WHERE id = $2', [tableName, entryId]);
    if(result[0]){
        return result[0];
    //Throws an error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
        err.status = 404;
        throw err;
    }
};

//Adds an entry to the specified table and returns the entry along with the newly assigned v4 UUID
//Uses the properties of the entry object to create a custom query statement
//Entry must begin with an undefined id property which will be assigned by the query
//Entry properties must match the columns of the table
const addEntry = async (entry, tableName) => {
    //Uses the entry object to create arrays containing the columns and values to add
    let columnsArray = Object.getOwnPropertyNames(entry);
    columnsArray = columnsArray.slice(1);
    let valuesArray = Object.values(entry);
    valuesArray = valuesArray.slice(1);   
    //Queries the database to add the entry and returns the result
    let result = await db.query("INSERT INTO ${table:name} (${columns:name}) VALUES (${values:csv}) RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray
    });
    return result[0];
};

//Updates the entry with the specified id in the specified table
//Entry must be an object that begins with an id property
//Entry properties must match the columns of the table
const updateEntry = async (entryId, entry, tableName) => {
    //Uses the entry object to create arrays containing the columns and values to update
    let columnsArray = Object.getOwnPropertyNames(entry);
    let valuesArray = Object.values(entry);
    //Queries the database to update the entry and returns the result
    let result = await db.query("UPDATE ${table:name} SET (${columns:name}) = (${values:csv}) WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray,
        id: entryId
    });
    if(result[0]){
        return result[0];
    //Throws an error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${id} does not exist.`);
        err.status = 404;
        throw err;
    }
};

//Deletes an entry of specified ID from the specified table and returns the deleted entry
const deleteEntry = async (entryId, tableName) => {
    //Queries the database to delete the entry of the specified id and returns the result
    let result = await db.query("DELETE FROM ${table:name} WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        id: entryId
    });
    if(result.length === 1){
        return result[0];
    //Throws an error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
        err.status = 404;
        throw err;
    }
};

//Increments the specified numeric column of the entry with the specified id in the specified table by the specified amount
const incrementEntryColumn = async (entryId, columnName, tableName, amountToIncrement) => {
    //Queries the database to add the specified amount and returns the new updated entry    
    let result = await db.query('UPDATE ${table:name} SET ${column:name} = ${column:name} + ${amount:csv} WHERE id = ${id:csv} RETURNING *', {
        table: tableName,
        column: columnName,
        amount: amountToIncrement,
        id: entryId
    });
    if(result.length === 1){
        return result[0];
    //Throws an error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
        err.status = 404;
        throw err;
    }
};  
    
//Transfers a specified numeric ammount from one specified column of a specified entry from a specified table to another
const transferColumnAmount = async (fromEntryId, toEntryId, columnName, tableName, amountToTransfer) => {
        //Checks that the original entries exist and saves them
        let fromEntryOriginal = await getEntry(fromEntryId, tableName);
        let toEntryOriginal = await getEntry(toEntryId, tableName);
        //Updates the entries and returns the updated entries if successful
        try{
            let fromEntryUpdated = await incrementEntryColumn(fromEntryId, columnName, tableName, -amountToTransfer);
            let toEntryUpdated = await incrementEntryColumn(toEntryId, columnName, tableName, amountToTransfer);
            return [fromEntryUpdated, toEntryUpdated];
        //Resets the entries in case there was an error and throws it
        }catch(err){
            await updateEntry(fromEntryId, fromEntryOriginal, tableName);
            await updateEntry(toEntryId, toEntryOriginal, tableName);
            throw err;
        }
};

//Exports functions to be used in other modules
module.exports = {
    getAllEntries,
    getEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    incrementEntryColumn,
    transferColumnAmount
};