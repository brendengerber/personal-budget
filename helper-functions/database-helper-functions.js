//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.
//Database functions are paramaterized and dynamic table/column names are escaped to avoid SQL injection 
//As long as the table exists, the id exists, and columns present in the entry object's properties exist, the query will succeed

//Imports necessary modules
const {db} = require('../queries.js');

//Returns an array of all entries of a table
const getAllEntries = async (tableName) => {
    let result = await db.query('SELECT * FROM $1:name', [tableName]);
    if(result.length > 0){
        return result;
    }else{
        const err = new Error(`Error: there are no entries in ${tableName}.`);
        err.status = 404;
        throw err;
    }
};

//Finds and returns the entry with the requested id
const getEntry = async (entryId, tableName) => {
    
    //Queries the database to find the entry of the specified id and returns the result
    let result = await db.query('SELECT * FROM $1:name WHERE id = $2', [tableName, entryId]);

    if(result[0]){
        return result[0];

    //Throws a 404 Error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
        err.status = 404;
        throw err;
    }
};

//Adds an entry to the specified table and returns the newly assigned v4 UUID
//Uses the properties of the entry object to create a custom paramaterized query statement
//Entry properties must match the columns of the INSERT query
//*******add id arg to match even though it is in entry? */
const addEntry = async (entry, tableName) => {
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

//Entry must be an object that begins with an id property
const updateEntry = async (entryId, entry, tableName) => {
    let columnsArray = Object.getOwnPropertyNames(entry);
    let valuesArray = Object.values(entry);

    let result = await db.query("UPDATE ${table:name} SET (${columns:name}) = (${values:csv}) WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray,
        id: entryId
    });

    if(result[0]){
        return result[0];

    //Throws a 404 Error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${id} does not exist.`);
        err.status = 404;
        throw err;
    }
};

const deleteEntry = async (entryId, tableName) => {
    //Queries the database to delete the entry of the specified id
    let result = await db.query("DELETE FROM ${table:name} WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        id: entryId
    });

    if(result.length === 1){
        return;
    
    //Throws a 404 Error if the entry does not exist
    }else{
        const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
        err.status = 404;
        throw err;
    }
};

//****validate budget needs rework */
const incrementEntryColumn = async (entryId, columnName, tableName, amountToIncrement) => {
    let result = await db.query('UPDATE ${table:name} SET ${column:name} = ${column:name} + ${amount:csv} WHERE id = ${id:csv} RETURNING *', {
        table: tableName,
        column: columnName,
        amount: amountToIncrement,
        id: entryId
    });
        if(result.length === 1){
            return result[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
            err.status = 404;
            throw err;
        }
};  
    
const transferColumnAmount = async (fromEntryId, toEntryId, columnName, tableName, amountToTransfer) => {
        //Checks that the original entries exist and saves them
        let fromEntryOriginal = await getEntry(fromEntryId, tableName);
        let toEntryOriginal = await getEntry(toEntryId, tableName);

        try{
            //Updates the entries and returns if successful
            await incrementEntryColumn(fromEntryId, columnName, tableName, -amountToTransfer);
            await incrementEntryColumn(toEntryId, columnName, tableName, amountToTransfer);
            return;
    
        }catch(err){
            //Resets the entries in case there was an error and throws it
            await updateEntry(fromEntryId, fromEntryOriginal, tableName);
            await updateEntry(toEntryId, toEntryOriginal, tableName);
            throw err;
        }
};

module.exports = {
    getAllEntries,
    getEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    incrementEntryColumn,
    transferColumnAmount
};