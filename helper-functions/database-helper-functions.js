//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.

//Imports necessary modules
const {pool} = require('../queries.js');
const crypto = require('crypto');

//Returns the entry with the request id if it exists, if not it will return undefined allowing middleware to send a 404
const findEntry = async (table, searchId) => {
    try{
        let result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [searchId]);
        return result.rows[0];
    }catch(err){
        throw err;
    };
};

const addEntry = async (entry, table) => {
    try{
        let queryParameters = Object.getOwnPropertyNames(entry);
        let values = [];
        for(let i = 1; i <= queryParameters.length; i++){
            values.push(`$${i}`);
        }
        let addedEntry = await pool.query(`INSERT INTO ${table} (${queryParameters.join(', ')}) VALUES (${values.join(', ')}) RETURNING *`, [entry.category, entry.budget]);
        return addedEntry.rows[0];
    }catch(err){
        throw err;
    };
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
    findEntry,
    addEntry,
    updateEntry,
    deleteEntry,
    updateEntryBudget
};