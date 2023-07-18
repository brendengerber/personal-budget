//Imports database services
const {getAllEntries, getEntryById, addEntry, updateEntry, deleteEntry, addToColumn} = require('../services/database-services.js');
const {batchQuery} = require('../utilities/database-utilities.js')
const {db} = require('../queries.js');

//Gets all purchases and adds them to req.purchase
const getAllPurchases = async (req, res, next) => {
    try{
        req.purchases = await getAllEntries('purchases');
        next();
    }catch(err){
        next(err);
    }
};

//Gets the purchase of the specified id and attatches it to req.purchase
const getPurchaseById =  async (req, res, next) => {
    try{
        req.purchase =  await getEntryById(req.purchaseId, 'purchases');
        next();
    }catch(err){
        next(err);
    }
};

//Adds a purchase, assigns it a v4 UUID, updates the budget of the corrisponding envelope, attatches the purchase along with its new v4 UUID to req.purchase, and attatches the updated envelope to req.envelope
const addPurchase = async (req, res, next) => {
    try{
        let updatedEntries = await batchQuery(() => 
            [
                addEntry(req.purchase, 'purchases'),
                addToColumn('envelopes', 'budget', req.purchase.envelope_id, -req.purchase.amount)
            ]);
        req.purchase = updatedEntries[0];
        req.envelope = updatedEntries[1];
        next();
    }catch (err){
        next(err);
    }
};

//Updates the purchase of the specified id with a new purchase, attatches the updated purchase to req.purchase, and attatches the corrisponding updated envelope to req.envelope
//New purchase can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updatePurchaseById = async (req, res, next) => {
    let oldPurchase = await getEntryById(req.purchase.id, 'purchases');
    try{
        let updatedEntries = await batchQuery(() => 
            [
                updateEntry(req.purchase.id, req.purchase, 'purchases'),
                addToColumn('envelopes', 'budget', req.purchase.envelope_id, oldPurchase.amount - req.purchase.amount)
            ]);
        req.purchase = updatedEntries[0];
        req.envelope = updatedEntries[1];
        next();
    }catch(err){
        next(err);
    }
};

//Deletes the purchase of the specified id and attatches the deleted purchase to req.purchaseDeleted
const deletePurchaseById = async (req, res, next) => {
    try{
        req.purchaseDeleted  = await deleteEntry(req.purchaseId, 'purchases');
        next();
    }catch(err){
        next(err);
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