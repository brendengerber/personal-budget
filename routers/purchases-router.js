//Imports necessary modules
const express = require('express');
const {checkParamId, checkReqPurchase} = require('../custom-middleware/validation-and-sanitization-middleware.js');
const {getAllPurchases, getPurchaseById, addPurchase, updatePurchaseById, deletePurchaseById} = require('../custom-middleware/purchases-database-middleware.js');

//Creates the router
const purchasesRouter = express.Router();

//Validates and sanitizes all id parameters
purchasesRouter.param('id', checkParamId('purchaseId'));

//Gets all purchase and sends them as an array
purchasesRouter.get('/', getAllPurchases, (req, res, next) => {
    res.status(200).send(req.purchases);
});

//Gets an purchase with the specified id and sends it
purchasesRouter.get('/:id', getPurchaseById, (req, res, next) => {
    res.status(200).send(req.purchase);
});

//Posts a new purchase and sends an array consiting of the new purchase with its newly assigned v4 UUID and the cooresponding envelope with its updated budget
//Body must be the new purchase in the form of a JSON object: {"envelope_id": v4 UUID string, amount: xxxx.xx number}
purchasesRouter.post('/', checkReqPurchase, addPurchase, (req, res, next) => {
    res.status(201).send([req.purchase, req.envelope]);
});

//Deletes the purchase with the specified id and sends it
purchasesRouter.delete('/:id', deletePurchaseById, (req, res, next) => {
    res.status(200).send(req.purchaseDeleted);
});

//Updates a new purchase and sends an array consiting of the updated purchase and the cooresponding envelope with its updated budget
//Body must be the new purchase in the form of a JSON object: {"id": v4 UUID string, "category": string, "budget": xxxx.xx number} or {"category": string, "budget": xxxx.xx number}
purchasesRouter.put('/:id', checkReqPurchase, updatePurchaseById, (req, res, next) => {
    res.status(200).send([req.purchase, req.envelope]);
});

//Exports the router
module.exports = purchasesRouter;