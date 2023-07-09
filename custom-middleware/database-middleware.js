//All the actual deleting, updating, etc are performed the database-helper-functions so they can be reused
//For example the budget transfer middleware uses an update function, which is also used in the middleware that updates a single envelope
//Those functions will return false if the resource does not exist 
//To minimize calls to the database, all checks for the existance of a resource will occur in each middleware that accesses the database 
//This is done in the form of an if statement that checks if the database-helper-function returns false or a resource
//************Change export and import orders to match the order in this file
//**********Update comments to match  */


//Imports database helper functions
const {findEntry, addEntry, updateEntry, deleteEntry, updateEntryBudget} = require('../helper-functions/database-helper-functions.js');

//Adds an envelope
const addEnvelope = async (req, res, next) => {
    try{
        //Sets req.envelope to the newly created database entry including its assigned v4 UUID
        req.envelope = await addEntry(req.envelope, 'envelopes');
        next();
    }catch (err){
        next(err);
    }
};

// Checks if an envelope exists by id, attatches it to the req object, and sends a 404 error if it does not exist
const findEnvelopeById =  async (req, res, next) => {
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

//Updates the envelope with the specified id with a specified new envelope
const updateEnvelopeById = async (req, res, next) => {
    try{
        req.envelope = await updateEntry(req.envelope, 'envelopes');
        if(req.envelope){
            return next();
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        next(err);
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
        next(err);
    }
};

//Transfers the specified budget from the specified envelope to the second specified envelope
//**********needs refactoring to asyn for findEntry */
//*********move transfer logic to helper functions? */
const transferEnvelopeBudget = (req, res, next) => {
    try{
        //Saves the original envelopes
        let fromEnvelopeOriginal = findEntry(req.fromId);
        let toEnvelopeOriginal = findEntry(req.toId);

        //Updates the envelopes if they both exist
        if(fromEnvelopeOriginal && toEnvelopeOriginal){
            let fromEnvelopeUpdated = updateEntryBudget(req.fromId, -req.transferBudget);
            let toEnvelopeUpdated = updateEntryBudget(req.toId, req.transferBudget);
            //Calls next() if both updates are successful
            if(fromEnvelopeUpdated && toEnvelopeUpdated){
                return next();
            // If some error occured and one envelope was not successfully updated, the envelopes are returned to their original states and an error message is sent
            }else if(!fromEnvelopeUpdated || !toEnvelopeUpdated){
                updateEntry(fromEnvelopeOriginal, 'envelopes');
                updateEntry(toEnvelopeOriginal, 'envelopes');
                return res.status(500).send({message: 'An unknown error has occured and envelopes have been reset to their original values'});
            }
        }
        
        //If one or both of the envelopes do not exist, an error message is created and sent
        let errorMessage = ``;
        if(!fromEnvelopeOriginal){
            errorMessage += ` Envelope with ID ${req.fromId} does not exist.`;
        }
        if(!toEnvelopeOriginal){
            errorMessage += ` Envelope with ID ${req.toId} does not exist.`;
        }
        res.status(404).send({message: errorMessage.trim()});
        
    }catch(err){
        next(err);
    }
};

module.exports = {
    addEnvelope,
    findEnvelopeById,
    deleteEnvelopeById,
    updateEnvelopeById,
    transferEnvelopeBudget
};

