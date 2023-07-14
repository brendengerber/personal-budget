//This file contains database services that manipulate the database in some way
//They are kept separate not only to reuse, but also to separate functionality
//They are generic and can be used dynamically on any table by multiple modules for multiple purposes
//They are paramaterized and dynamic table/column names are escaped to avoid SQL injection 
//If the data storage method is changed, these functions can be refactored to return the same results without affecting the rest of the server and allowing it to continue functioning as normal

//Imports necessary modules
const {db} = require('../queries.js');
const {handleTransactionErr, handleQueryErr} = require('../utilities/database-utilities.js')

//Returns an array of all entries from a specified table
const getAllEntries = (tableName) => {
    //Queries the database to return all entries from  the specified table
    return db.any('SELECT * FROM $1:name', [
        tableName
    ]).catch(err => handleQueryErr(err));
};

//Finds and returns the entry with the specified id from the specified table
const getEntryById = (entryId, tableName) => {
    //Queries the database to find the entry of the specified id and returns the result
    return db.one('SELECT * FROM $1:name WHERE id = $2', [
        tableName, 
        entryId
    ]).catch(err => handleQueryErr(err));
};









//Finds and returns the entries from a specified table that match a specified value in a specified column
const getMatchingEntries = (tableName, column, value) => {
    return db.any('SELECT * FROM $1:name WHERE $2:name = $3', [
        tableName, 
        column, 
        value
    ]).catch(err => handleQueryErr(err));
};












//Adds an entry to the specified table and returns the entry along with the newly assigned v4 UUID
//Uses the properties of the entry object to create a custom query statement
//Entry must begin with an undefined id property which will be assigned by the query
//Entry properties must match the columns of the table
const addEntry = (entry, tableName) => {
    //Uses the entry object to create arrays containing the columns and values to add
    let columnsArray = Object.getOwnPropertyNames(entry);
    columnsArray = columnsArray.slice(1);
    let valuesArray = Object.values(entry);
    valuesArray = valuesArray.slice(1);   
    //Queries the database to add the entry and returns the result
    db.one("INSERT INTO ${table:name} (${columns:name}) VALUES (${values:csv}) RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray
    }).catch(err => handleQueryErr(err));
};

//Updates the entry with the specified id in the specified table
//Entry must be an object that begins with an id property
//Entry properties must match the columns of the table
const updateEntry = (entryId, entry, tableName) => {
    //Uses the entry object to create arrays containing the columns and values to update
    let columnsArray = Object.getOwnPropertyNames(entry);
    let valuesArray = Object.values(entry);
    //Queries the database to update the entry and returns the result
    return db.one("UPDATE ${table:name} SET (${columns:name}) = (${values:csv}) WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        columns: columnsArray,
        values: valuesArray,
        id: entryId
    }).catch(err => handleQueryErr(err));
};

//Deletes an entry of specified ID from the specified table and returns the deleted entry
const deleteEntry = (entryId, tableName) => {
    //Queries the database to delete the entry of the specified id and returns the result
    return db.one("DELETE FROM ${table:name} WHERE id = ${id:csv} RETURNING *", {
        table: tableName,
        id: entryId
    }).catch(err => handleQueryErr(err));
}; 

//Transfers an amount from the column of one entry to the a column on a different entry
 const transferAmountBetweenColumns = (fromTable, fromColumn, fromId, toTable, toColumn, toId, amount) => {
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
    }).catch(err => handleTransactionErr(err));
 };

 const subtractColumnFromColumn = (fromTable, fromColumn, fromId, toTable, toColumn, toId) => {
    //Quries the fromTable to get the amount to subtract from the toTable
    let subtractionAmount = db.one('SELECT ${column:name} FROM ${table:name} WHERE id = ${id:csv}', {
        column: fromColumn,
        table: fromTable,
        id: fromId
    }).catch(err => handleQueryErr(err));
    return db.one('UPDATE $table:name SET ${column:name} = ${column:name} - ${amount:csv} WHERE id = ${id:csv}', {
        table: toTable,
        column: toColumn,
        amount: subtractionAmount,
        id: toId
    }).catch(err => handleQueryErr(err));
 }



//Exports functions to be used in other modules
module.exports = {
    getAllEntries,
    getEntryById,
    getMatchingEntries,
    addEntry,
    updateEntry,
    deleteEntry,
    subtractColumnFromColumn
};
