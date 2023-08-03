//Imports necessary modules
const {db} = require('../queries.js');

//Processes an error thrown by a database transaction
//This function separates if the error was thrown due to a resource not existing or due to some other database error
//Returns the err with newly added content to be handled by middleware
const processTransactionErr = (err) => {
    if(err.data){
        //Finds the index of the first query of the transaction that failed
        const failedIdx = err.data.findIndex(e => !e.success);
        //Processes the err resluting from one of the entries not existing
        //Called if there is a failed query that doesn't contain a database error code
        if((failedIdx || failedIdx === 0) && !err.data[failedIdx].result.code){
            err.message = 'Error: one or both of the requested entries do not exist.';
            err.status = 404;
            throw err;
        //Processes the err in case of some other unforseen database error
        //Called if there is a failed query that does contain a database error code
        }else{
            err.message = `Error: Database server encountered an error with code ${err.data[failedIdx].result.code}.`;
            throw err;
        }
    }else{
        err.message = `Error: Database server encountered an error with code ${err.code}.`
        throw err;
    }
};

//Processes an error thrown by a standard query
//This function separates if the error was thrown due to a resource not existing or due to some other database error
//Returns the err with newly added content to be handled by middleware
const processQueryErr = (err) => {
    if(!err.code){
        err.message = 'Error: the requested entry does not exist.';
        err.status = 404;
        throw err;
    }else{
        err.message = `Error: Database server encountered an error with code ${err.code}.`;
        throw err;
    }
};

//Performs a batch query that will only succeed if all queries of the batch succeed
//Takes a callback that returns an array of queries that return promises and can take database-services.js functions as part of the array
//Handles any errors encountered and rolls back any queries in case of a failure
//A callback must be used so query services are called in the batch method rather than immediately if an array of services was used as the argument instead
//The callback has one argument which is the context that this function will insert into each function of the array, namely t
//The callback must return an array of the database service functions to run with the callback's context argument as their last parameter
/*
For example:
batchQuery(batchContext => [
    addToColumn('envelopes', 'budget', req.envelopeFromId, -req.transferBudget, batchContext),
    addToColumn('envelopes', 'budget', req.envelopeToId, req.transferBudget, batchContext)
]);
*/
const batchQuery = (queryArrayCallback) => {
    return db.tx(t => {
        return t.batch(queryArrayCallback(t));
    }).catch(err => processTransactionErr(err));
};

//Exports functions to be used in other modules
module.exports = {
    processTransactionErr,
    processQueryErr,
    batchQuery
};

