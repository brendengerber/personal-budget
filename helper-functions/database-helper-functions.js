//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.

//Imports envelopes
let envelopes = require('../envelopes.js');

//Helper function used in this module
const findEntryIndex = (searchId) => {    
    let index = envelopes.findIndex((envelope) => envelope.id == searchId);
    if(index !== -1 ){
        return index
    }
    return false
};

const assignEntryId = (array) => {
    let newId;
    console.log(array)
    console.log(array[1])
    if(array.length === 0){
        newId = 1;
    }else{
        newId = array[array.length - 1].id + 1;
        console.log(newId)
    }
    return newId;
};

const findEntry = (searchId) => {
    for(envelope of envelopes){
        if(envelope.id === searchId){
            return envelope
        }
    }
    return false
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