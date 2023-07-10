//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.
//***********do these need to have catch(err){throw err} ????  or will it be thrown and caught by the next one?  remove the catch, turn database off, and test*/ looks like can delete
//Database functions are paramaterized and dynamic table/column names are escaped to avoid SQL injection 
//As long as the table exists, the id exists, and columns present in the entry object's properties exist, the query will succeed

//Imports necessary modules
const {db} = require('../queries.js')

//Finds and returns the entry with the requested id
const findEntry = async (entryId, tableName) => {
    try{
        //Queries the database to find the entry of the specified id and returns the result
        let result = await db.query('SELECT * FROM $1:name WHERE id = $2', [tableName, entryId])
        if(result[0]){
            return result[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: ${tableName.slice(0, -1)} with ID ${entryId} does not exist.`);
            err.status = 404;
            throw err;
        }
    }catch(err){
        throw err;
    };
};

//Adds an entry to the specified table and returns the newly assigned v4 UUID
//Uses the properties of the entry object to create a custom paramaterized query statement
//Entry properties must match the columns of the INSERT query
//*******add id arg to match even though it is in entry? */
const addEntry = async (entry, tableName) => {
    try{
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
    }catch(err){
        throw err;
    };
};

//Entry must be an object that begins with an id property
const updateEntry = async (entryId, entry, tableName) => {
    try{
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
        
    }catch(err){
        throw err;
    }
};

const deleteEntry = async (entryId, tableName) => {
    try{
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
    }catch(err){
        throw err;
    }
};



















const updateEntryColumn = async (id, column, value, table) => {
    try{
        let result = await pool.query(`UPDATE ${table} SET ${column} = $2 WHERE id = $1`, [id, value])
        if(result.rows[0]){
            return result.rows[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: ${table.slice(0, -1)} with ID ${entry.id} does not exist.`);
            err.status = 404;
            throw err;
        }
    }catch(err){
        throw err;
    }
};

const updateEnvelopeBudget = async (id, budget, table) => {
    try{
        let result = await pool.query(`UPDATE ${table} SET ${column} = ${column} + ${budget} WHERE id = $1`, [id])
        if(result.rows[0]){
            return result.rows[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: ${table.slice(0, -1)} with ID ${entry.id} does not exist.`);
            err.status = 404;
            throw err;
        }

    }catch(err){
        throw err;
    }
}  
    






module.exports = {
    findEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    updateEntryColumn
};