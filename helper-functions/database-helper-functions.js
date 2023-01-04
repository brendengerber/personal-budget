//This file contains helper functions that manipulate the database in some way and can be used by routers
//These functions return false if the resource does not exist which allows middleware to check existance using an if statement and sending a 404 if it is false
//These functions are separate from the middleware. If we change where a resource is located it will need new code to manipulate it, that code can go here, leaving the actual routers untouched as the new functions will return the same results as before.

//Imports envelopes
let envelopes = require('../envelopes.js');

const findEnvelope = (searchId) => {
    for(envelope of envelopes){
        if(envelope.id === searchId){
            return envelope
        }
    }
    return false
}

const findEnvelopeIndex = (searchId) => {    
    let index = envelopes.findIndex((envelope) => envelope.id == searchId);
    if(index !== -1 ){
        return index
    }
    return false
} 
    
const updateEnvelope = (id, newEnvelope) => {
    let index = findEnvelopeIndex(id);
    if(index || index === 0){
        envelopes[index] = newEnvelope;
        return envelopes[index]
    }
    return false
}

const deleteEnvelope = (id) => {
    let index = findEnvelopeIndex(id)  ;  
    if(index || index === 0){
        return envelopes.splice(index, 1);
    }
    return false
}

const updateBudget = (id, transferBudget) => {
    let index = findEnvelopeIndex(id);
    if(index || index === 0){
        envelopes[index].budget = envelopes[index].budget + transferBudget;
        return envelopes[index];
    }
    return false
}

module.exports = {
    findEnvelope,
    findEnvelopeIndex,
    updateEnvelope,
    deleteEnvelope,
    updateBudget
};