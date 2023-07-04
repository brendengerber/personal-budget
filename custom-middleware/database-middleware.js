//All the actual deleting, updating, etc are performed the database-helper-functions so they can be reused
//For example the budget transfer middleware uses an update function, which is also used in the middleware that updates a single envelope
//Those functions will return false if the resource does not exist 
//To minimize calls to the database, all checks for the existance of a resource will occur in each middleware that accesses the database 
//This is done in the form of an if statement that checks if the database-helper-function returns false or a resource
//************Change export and import orders to match the order in this file

//Imports database helper functions
const {findEntry, assignEntryId, addEntry, updateEntry, deleteEntry, updateEntryBudget} = require('../helper-functions/database-helper-functions.js');

//Adds an envelope
const addEnvelope = async (req, res, next) => {
    try{
        await addEntry(req.envelope, 'envelopes');
        next();
    }catch (err){
        next(err);
    }
};

//Assigns an id to the envelope in the req body based on the current highest id
//Can also refactor using
const assignEnvelopeId = async (req, res, next) => {
    try{
        req.envelope.id = await assignEntryId('envelopes');
        next();
    }catch(err){
        next(err);
    }
};

// Checks if an envelope exists by id, attatches it to the req object, and sends a 404 error if it does not exist
const attatchEnvelopeById =  async (req, res, next) => {
    try{
        //Sets req.envelope to the envelope that corisponds with the id
        req.envelope =  await findEntry('envelopes', req.id);
        if(req.envelope){
            return next();
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        next(err);
    }
};


















//Assembles an envelope object from the req properties
const assembleEnvelope = (req, res, next) => {
    try{
        req.envelope = {};
        req.envelope.budget = req.budget;
        req.envelope.category = req.category;
        req.envelope.id = req.id;
        next();
    }catch(err){
        res.status(500).send(err.message);
    }
};



//Updates the envelope with the specified id with a specified new envelope
const updateEnvelopeById = (req, res, next) => {
    try{
        if(updateEntry(req.id, req.envelope)){
            return next();
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err.message);
    }
};

//Deletes the envelope of the specified id
const deleteEnvelopeById = (req, res, next) => {
    try{
        if(deleteEntry(req.id)){
            return next();
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err.message);
    }
};

//Transfers the specified budget from the specified envelope to the second specified envelope
//**********needs refactoring to asyn for findEntry */
const transferEnvelopeBudget = (req, res, next) => {
    try{
        //Saves the original envelopes
        let fromEnvelopeOriginal = findEntry(req.fromId);
        let toEnvelopeOrigional = findEntry(req.toId);

        //Updates the envelopes if they both exist
        if(fromEnvelopeOriginal && toEnvelopeOrigional){
            let fromEnvelopeUpdated = updateEntryBudget(req.fromId, -req.transferBudget);
            let toEnvelopeUpdated = updateEntryBudget(req.toId, req.transferBudget);
            //Calls next() if both updates are successful
            if(fromEnvelopeUpdated && toEnvelopeUpdated){
                return next();
            // If some error occured and one envelope was not successfully updated, the envelopes are returned to their original states and an error message is sent
            }else if(!fromEnvelopeUpdated || !toEnvelopeUpdated){
                updateEntry(req.fromId, fromEnvelopeOriginal);
                updateEntry(req.toId, toEnvelopeOrigional);
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
        res.status(500).send(err.message);
    }
};

module.exports = {
    attatchEnvelopeById,
    addEnvelope,
    assignEnvelopeId,
    assembleEnvelope,
    deleteEnvelopeById,
    updateEnvelopeById,
    transferEnvelopeBudget
};

