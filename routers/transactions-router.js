//*************NEED TO validate transaction objects in routes still */


//Imports necessary modules
const express = require('express');
const {validateIdParam, validateReqTransferBudget} = require('../custom-middleware/validation-middleware.js');
const {getAllTransactions, getTransactionById, addTransaction, updateTransactionById, deleteTransactionById} = require('../custom-middleware/transactions-database-middleware.js');

//Creates the router
const transactionsRouter = express.Router();

//Validates all id parameters
transactionsRouter.param('transactionId', validateIdParam('id'));

//Gets all transaction and sends them as an array
transactionsRouter.get('/', getAllTransactions, (req, res, next) => {
    res.status(200).send(req.transactions);
});

//Gets an transaction with the specified id and sends it
transactionsRouter.get('/:id', getTransactionById, (req, res, next) => {
    res.status(200).send(req.transaction);
});





//Posts a new transaction and sends the posted transaction along with the newly generated v4 UUID
//Body must be the new transaction in the form of a JSON object: {"envelope_id": v4 UUID string, amount: xxxx.xx number}
transactionsRouter.post('/', addTransaction, (req, res, next) => {
    res.status(201).send(req.transaction);
});










//Deletes the transaction with the specified id and sends it
transactionsRouter.delete('/:id', deleteTransactionById, (req, res, next) => {
    res.status(200).send(req.transactionDeleted);
});

//Updates the transaction with the specified id and sends the newly updated transaction
//Body must be the new transaction in the form of a JSON object: {"id": v4 UUID string, "category": string, "budget": xxxx.xx number} or {"category": string, "budget": xxxx.xx number}
transactionsRouter.put('/:id', updateTransactionById, (req, res, next) => {
    res.status(200).send(req.transaction);
});

//Exports the router
module.exports = transactionsRouter;