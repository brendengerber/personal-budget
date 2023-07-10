//All the actual deleting, updating, etc are performed the database-helper-functions so they can be reused
//For example the budget transfer middleware uses an update function, which is also used in the middleware that updates a single envelope
//**********Update comments to match  */


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

//Checks if an envelope exists by id, attatches it to the req object
const getEnvelopeById =  async (req, res, next) => {
    try{
        //Sets req.envelope to the envelope that corisponds with the id
        req.envelope =  await getEntry(req.id, 'envelopes');
        next();
    }catch(err){
        next(err);
    }
};

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

//Updates the envelope with the specified id with a specified new envelope
//New envelope can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updateEnvelopeById = async (req, res, next) => {
    try{
        req.envelope = await updateEntry(req.id, req.envelope, 'envelopes');
        if(req.envelope){
            return next();
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        next(err);
    }
};

//Deletes the envelope of the specified id
const deleteEnvelopeById = async (req, res, next) => {
    try{
        req.envelope  = await deleteEntry(req.id, 'envelopes');
        next();
    }catch(err){
        next(err);
    }
};

//Transfers a specified budget from a specified envelope to a second specified envelope
const transferEnvelopeBudgetByIds = async (req, res, next) => {
    try{
        await transferColumnAmount(req.fromId, req.toId, "budget", "envelopes", req.transferBudget);
        next();
    }catch(err){
        next(err);
    }
};

module.exports = {
    getAllEnvelopes,
    getEnvelopeById,
    addEnvelope,
    updateEnvelopeById,
    deleteEnvelopeById,
    transferEnvelopeBudgetByIds
};