//To minimize calls to the database, all checks for the existance of a resource will occur in each middleware that accesses the database in the form of an if statement
//All the actual deleting, updating, etc are in the helper functions so they can be reused

//Each function checks if the resource exists and sends 404 if not

//Imports envelopes and database helper functions
let envelopes = require('../envelopes.js');
const {findEnvelope, findEnvelopeIndex, updateEnvelope, deleteEnvelope, updateBudget} = require('../helper-functions/database-helper-functions.js');

//Adds an envelope
const addEnvelope = (req, res, next) => {
    try{
        envelopes.push(req.envelope);
        next();
    }catch (err){
        res.status(500).send(err);
    }
};

//Assigns an id to the envelope in the req body based on the current highest id
const assignEnvelopeId = (req, res, next) => {
    try{
        let newId;
        if(envelopes.length === 0){
            newId = 1;
        }else{
            newId = envelopes[envelopes.length - 1].id + 1;
        }
        req.envelope.id = newId;
        next();
    }catch(err){
        res.status(500).send(err);
    }
}

// Checks if an envelope exists by id, attatches it to the req object, and sends an error if it does not exist
const attatchEnvelopeById = (req, res, next) => {
    try{
        //Sets req.envelope to the envelope that corisponds with the id, and is set to undefined if the resources doesn't exist
        req.envelope = findEnvelope(req.id);
        if(req.envelope){
            return next()
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err);
    }
}

//Updates the envelope with the specified id with a specified new envelope
const updateEnvelopeById = (req, res, next) => {
    try{
        if(updateEnvelope(req.id, req.envelope)){
            return next()
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err);
    }
}

//Deletes the envelope of the specified id
const deleteEnvelopeById = (req, res, next) => {
    try{
        if(deleteEnvelope(req.id)){
            return next()
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err);
    }
}

//Transfers the specified budget from the specified envelope to the second specified envelope
const transferEnvelopeBudget = (req, res, next) => {
    try{
        //Saves the original envelopes
        let fromEnvelopeOriginal = findEnvelope(req.fromId);
        let toEnvelopeOrigional = findEnvelope(req.toId);

        //Updates the envelopes if they both exist
        if(fromEnvelopeOriginal && toEnvelopeOrigional){
            let fromEnvelopeUpdated = updateBudget(req.fromId, -req.transferBudget);
            let toEnvelopeUpdated = updateBudget(req.toId, req.transferBudget);
            //Calls next() if both updates are successful
            if(fromEnvelopeUpdated && toEnvelopeUpdated){
                return next()
            // If some error occured and one envelope was not successfully updated, the envelopes are returned to their original states and an error message is sent
            }else if(!fromEnvelopeUpdated || !toEnvelopeUpdated){
                updateEnvelope(req.fromId, fromEnvelopeOriginal);
                updateEnvelope(req.toId, toEnvelopeOrigional);
                return res.status(500).send({message: 'An unknown error has occured and envelopes have been reset to their original values'});
            }
        }
        
        //If one or both of the envelopes do not exist, an error message is created and sent
        let errorMessage = ``;
        if(!fromEnvelopeOriginal){
            errorMessage += ` Envelope with ID ${req.fromId} does not exist.`;
        }
        if(!toEnvelopeOrigional){
            errorMessage += ` Envelope with ID ${req.toId} does not exist.`;
        }
        res.status(404).send({message: errorMessage.trim()});
        
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = {
    attatchEnvelopeById,
    addEnvelope,
    assignEnvelopeId,
    deleteEnvelopeById,
    updateEnvelopeById,
    transferEnvelopeBudget
};

