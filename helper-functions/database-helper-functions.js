//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.

//Imports necessary modules
const {pool} = require('../queries.js');

//** needs refactoring */
const assignEntryId = async (table) => {
    try{
        let newId;
        let unique = undefined;

        //Continues generating v4 UUIDs until a unique one is generated
        while(!unique){
            newId = crypto.randomUUID();
            if(await !findEntry(table, newId)){
                unique = true;
            }
            
        }
        //Reserves the v4 UUID so it cannot be taken by another request coming in before processing has been completed
        //********** need to probably reserve this with a blank add, then use update instead of insert for POST   

        //Returns the v4 UUID for use in consequent functions and middleware
        return newId;
    }catch(err){
        throw err;
    }
};

//Returns the entry with the request id if it exists, if not it will return undefined allowing middleware to send a 404
const findEntry = async (table, searchId) => {
    try{
        let result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [searchId]);
        return result.rows[0];
    }catch(err){
        throw err;
    };
};

const addEntry = (entry, array) => {
    array.push(entry);
};
   
const updateEntry = (id, newEnvelope) => {
    let index = findEntryIndex(id);
    if(index || index === 0){
        envelopes[index] = newEnvelope;
        return envelopes[index]
    }
    return false
};

const deleteEntry = (id) => {
    let index = findEntryIndex(id)  ;  
    if(index || index === 0){
        return envelopes.splice(index, 1);
    }
    return false
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
    assignEntryId,
    findEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    updateEntryBudget
};