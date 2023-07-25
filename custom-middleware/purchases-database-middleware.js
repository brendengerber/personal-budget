//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments and attatching results to the req object

//Imports database services
const {getAllEntries, getEntryById, addEntry, updateEntry, deleteEntry, addToColumn} = require('../services/database-services.js');
const {processQueryErr, processTransactionErr} = require('../utilities/database-utilities.js');
const {db} = require('../queries.js');

//Gets all purchases and adds them to req.purchase
const getAllPurchases = async (req, res, next) => {
    try{
        req.purchases = await getAllEntries('purchases');
        next();
    }catch(err){
        next(processQueryErr(err));
    }
};

//Gets the purchase of the specified id and attatches it to req.purchase
const getPurchaseById =  async (req, res, next) => {
    try{
        req.purchase =  await getEntryById(req.purchaseId, 'purchases');
        next();
    }catch(err){
        next(processQueryErr(err));
    }
};

//Adds a purchase, assigns it a v4 UUID, updates the budget of the corrisponding envelope, attatches the purchase along with its new v4 UUID to req.purchase, and attatches the updated envelope to req.envelope
//Performs a batch query that will only succeed if all queries of the batch succeed
//Handles any errors encountered and rolls back queries in case of a failure
const addPurchase = async (req, res, next) => {
    try{
        let updatedEntries = await db.tx(t => {
            return t.batch([
                addEntry(req.purchase, 'purchases', t),
                addToColumn('envelopes', 'budget', req.purchase.envelope_id, -req.purchase.amount, t)
            ])
        });
        req.purchase = updatedEntries[0];
        req.envelope = updatedEntries[1];
        next();
    }catch (err){
        next(processTransactionErr(err));
    }
};

//Updates the purchase of the specified id with a new purchase, attatches the updated purchase to req.purchase, and attatches the corrisponding updated envelope to req.envelope
//New purchase can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updatePurchaseById = async (req, res, next) => {
    let oldPurchase = await getEntryById(req.purchase.id, 'purchases');
    try{
        let updatedEntries = await db.tx(t => {
            return t.batch([
                updateEntry(req.purchase.id, req.purchase, 'purchases', t),
                addToColumn('envelopes', 'budget', req.purchase.envelope_id, oldPurchase.amount - req.purchase.amount, t)
            ])
        });
        req.purchase = updatedEntries[0];
        req.envelope = updatedEntries[1];
        next();
    }catch(err){
        next(processTransactionErr(err));
    }
};

//Deletes the purchase of the specified id and attatches the deleted purchase to req.purchaseDeleted
const deletePurchaseById = async (req, res, next) => {
    try{
        req.purchaseDeleted  = await deleteEntry(req.purchaseId, 'purchases');
        next();
    }catch(err){
        next(processQueryErr(err));
    }
};

//Exports the functions for use in other modules
module.exports = {
    getAllPurchases,
    getPurchaseById,
    addPurchase,
    updatePurchaseById,
    deletePurchaseById
};