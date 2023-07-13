//Imports database services
const {getAllEntries, getEntryById, addEntry, updateEntry, deleteEntry} = require('../services/database-services.js');

//Gets all transactions and adds them to req.transaction
const getAllTransactions = async (req, res, next) => {
    try{
        req.transactions = await getAllEntries('transactions');
        next();
    }catch(err){
        next(err);
    }
};

//Gets the transaction of the specified id and attatches it to req.transaction
const getTransactionById =  async (req, res, next) => {
    try{
        req.transaction =  await getEntryById(req.transactionId, 'transactions');
        next();
    }catch(err){
        next(err);
    }
};

//Adds a transaction, assigns it a v4 UUID, and attatches the updated transaction to req.transaction
const addTransaction = async (req, res, next) => {
    try{
        req.transaction = await addEntry(req.transaction, 'transactions');
        next();
    }catch (err){
        next(err);
    }
};

//Updates the transaction of the specified id with a new transaction and attatches the updated transaction including id to req.transaction
//New transaction can either include or not include it's id, if it is included it will check to make sure it matches the parameter id
const updateTransactionById = async (req, res, next) => {
    try{
        req.transaction = await updateEntry(req.transactionId, req.envelope, 'transactions');
        next();
    }catch(err){
        next(err);
    }
};

//Deletes the transaction of the specified id and attatches the deleted transaction to req.transactionDeleted
const deleteTransactionById = async (req, res, next) => {
    try{
        req.transactionDeleted  = await deleteEntry(req.transactionId, 'transactions');
        next();
    }catch(err){
        next(err);
    }
};

//Exports the functions for use in other modules
module.exports = {
    getAllTransactions,
    getTransactionById,
    addTransaction,
    updateTransactionById,
    deleteTransactionById
};