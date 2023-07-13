//This file contains database services that manipulate the database in some way
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
const getEntryById = async (entryId, tableName) => {
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









//Finds and returns the entries from a specified table that match a specified value in a specified column
const getMatchingEntries = async (tableName, column, value) => {
    let result = await db.query('SELECT * FROM $1:name WHERE $2:name = $3', [tableName, column, value]);
    if(result.length > 0){
        return result;
    //Throws an error if no entries exist
    }else{
        const err = newError(`Error: There are no ${tableName} that are associated with ${column} ${value}`);
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

//Transfers an amount from the column of one entry to the a column on a different entry
 const transferColumnAmount = (fromTable, fromColumn, fromId, toTable, toColumn, toId, amount) => {
    return db.tx(t =>{
        return t.batch([
            t.one('UPDATE ${table:name} SET ${column:name} = ${column:name} + ${amount:csv} WHERE id = ${id:csv} RETURNING *', {
                table: fromTable,
                column: fromColumn,
                amount: -amount,
                id: fromId
            }),
            t.one('UPDATE ${table:name} SET ${column:name} = ${column:name} + ${amount:csv} WHERE id = ${id:csv} RETURNING *', {
                table: toTable,
                column: toColumn,
                amount: amount,
                id: toId
            })
        ]);
    }).catch((err) => {
        //Finds the index of the first query that failed
        const errIdx = err.data.findIndex(e => !e.success);
        //Handles any err resluting from a failed query
        if(errIdx || errIdx === 0){
            //Sets which Id and table caused the error based on the errIdx
            let errId;
            let errTable;
            if(errIdx === 0){
                errId = fromId;
                errTable = fromTable;
            }else if(errIdx === 1){
                errId = toId;
                errTable = fromTable;
            }
            //Sets the error message and status based on the failed Id
            err.message = `Error: ${errTable.slice(0, -1)} with ID ${errId} does not exist.`
            err.status = 404;
            throw err;
        //Handles the err in case of some other unforseen error
        }else{
            throw err;
        }
    })
 };

//Exports functions to be used in other modules
module.exports = {
    getAllEntries,
    getEntryById,
    getMatchingEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    transferColumnAmount
};
