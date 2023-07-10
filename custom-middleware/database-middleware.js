//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct helper functions with the correct arguments and attatching results to the req object

//Imports database helper functions
const {getAllEntries, getEntry, addEntry, updateEntry, deleteEntry, transferColumnAmount} = require('../helper-functions/database-helper-functions.js');

//Gets all envelopes and adds them to req.envelopes
const getAllEnvelopes = async (req, res, next) => {
    try{
        req.envelopes = await getAllEntries('envelopes');
        next();
    }catch(err){
        next(err);
    }
};

//Gets the envelope of the specified id and attatches it to req.envelope
const getEnvelopeById =  async (req, res, next) => {
    try{
        req.envelope =  await getEntry(req.id, 'envelopes');
        next();
    }catch(err){
        next(err);
    }
};

//Adds an envelope, assigns it a v4 UUID, and attatches the updated envelope to req.envelope
const addEnvelope = async (req, res, next) => {
    try{
        req.envelope = await addEntry(req.envelope, 'envelopes');
        next();
    }catch (err){
        next(err);
    }
};

//Updates the envelope of the specified id with a new envelope and attatches the updated envelope including id to req.envelope
//New envelope can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updateEnvelopeById = async (req, res, next) => {
    try{
        req.envelope = await updateEntry(req.id, req.envelope, 'envelopes');
        next();
    }catch(err){
        next(err);
    }
};

//Deletes the envelope of the specified id and attatches the deleted envelope to req.envelopeDeleted
const deleteEnvelopeById = async (req, res, next) => {
    try{
        req.envelopeDeleted  = await deleteEntry(req.id, 'envelopes');
        next();
    }catch(err){
        next(err);
    }
};

//Transfers a specified budget from one specified envelope to a second specified envelope and attatches an array of the updated envelopes to req.updatedEnvelopes
const transferEnvelopeBudgetByIds = async (req, res, next) => {
    try{
        req.updatedEnvelopes = await transferColumnAmount(req.fromId, req.toId, "budget", "envelopes", req.transferBudget);
        next();
    }catch(err){
        next(err);
    }
};

//Exports the functions for use in other modules
module.exports = {
    getAllEnvelopes,
    getEnvelopeById,
    addEnvelope,
    updateEnvelopeById,
    deleteEnvelopeById,
    transferEnvelopeBudgetByIds
};