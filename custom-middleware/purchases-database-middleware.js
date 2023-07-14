//Imports database services
const {getAllEntries, getEntryById, addEntry, updateEntry, deleteEntry, addPurchaseAndSubtractBudgetFromEnvelope} = require('../services/database-services.js');

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

//*********change to something like processPurchase */
//*************currently req.purchase being set to updated to an array with the envelope envelope....need to save them and send them differently to req.purchase, req.envelope and then send both
//Adds a purchase, assigns it a v4 UUID, and attatches the updated purchase to req.purchase
const addPurchase = async (req, res, next) => {
    try{
        let update = await addPurchaseAndSubtractBudgetFromEnvelope(req.purchase);
        req.purchase = update[0];
        req.envelope = update[1];
        next();
    }catch (err){
        next(err);
    }
};

//Updates the purchase of the specified id with a new purchase and attatches the updated purchase including id to req.purchase
//New purchase can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updatePurchaseById = async (req, res, next) => {
    try{
        req.purchase = await updateEntry(req.purchaseId, req.envelope, 'purchases');
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