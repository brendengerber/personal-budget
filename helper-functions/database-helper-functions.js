//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.

//Imports necessary modules
const {pool} = require('../queries.js');

//Finds and returns the entry with the requested id
const findEntry = async (id, table) => {
    try{
        //Queries the database to find the entry of the specified id and returns the result
        let result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        if(result.rows[0]){
            return result.rows[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: envelope with ID ${id} does not exist.`);
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
const addEntry = async (entry, table) => {
    try{
        let queryParameters = Object.getOwnPropertyNames(entry);
        queryParameters = queryParameters.slice(1);
        let values = Object.values(entry);
        values = values.slice(1);

        //Creates the array used to create the VALUES string
        let numberedPlaceholders = [];
        for(let i = 1; i <= queryParameters.length; i++){
            numberedPlaceholders.push(`$${i}`);
        }

        //Queries the database to add the entry and returns the result
        let result = await pool.query(`INSERT INTO ${table} (${queryParameters.join(', ')}) VALUES (${numberedPlaceholders.join(', ')}) RETURNING *`, values);
        return result.rows[0];
    }catch(err){
        throw err;
    };
};

//Entry must be an object that begins with an id property
const updateEntry = async (entry, table) => {
    try{
        let queryParameters = Object.getOwnPropertyNames(entry);
        let values = Object.values(entry);

        //Creates the array used to create the SET string
        let setStringArray = [];
        for(let i = 2; i <= queryParameters.length; i++){
            setStringArray.push(`${queryParameters[i-1]} = $${i}`);
        };

        //Queries the database to update the entry of the specified id and returns the result
        let result = await pool.query(`UPDATE ${table} SET ${setStringArray.join(', ')} WHERE id = $1 RETURNING *`, values);
        if(result.rows[0]){
            return result.rows[0];

        //Throws a 404 Error if the entry does not exist
        }else{
            const err = new Error(`Error: envelope with ID ${entry.id} does not exist.`);
            err.status = 404;
            throw err;
        }
        
    }catch(err){
        throw err;
    }
};








const deleteEntry = async (id) => {
    try{
        let result = await pool.query(``)
        return result.rows[0].id
    }catch(err){
        `No envelope with ID ${id} exists.`
    }
};
















const updateEntryBudget = (id, transferBudget) => {
    let index = findEntryIndex(id);
    if(index || index === 0){
        envelopes[index].budget = envelopes[index].budget + transferBudget;
        return envelopes[index];
    }
    return false
};

module.exports = {
    findEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    updateEntryBudget
};