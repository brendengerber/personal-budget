//Imports necessary modules
const {db} = require('../queries.js');

//Handles an error thrown by a database transaction
//This function separates if the error was thrown due to a resource not existing or due to some other database error
const handleTransactionErr = (err) => {
    if(err.data){
        //Finds the index of the first query of the transaction that failed
        const failedIdx = err.data.findIndex(e => !e.success);
        //Handles the err resluting from one of the entries not existing
        //Called if there is a failed query that doesn't contain a database error code
        if((failedIdx || failedIdx === 0) && !err.data[failedIdx].result.code){
            err.message = 'Error: one of the requested entries does not exist.';
            err.status = 404;
            throw err;
        //Handles the err in case of some other unforseen database error
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

//Handles an error thrown by a standard query
//This function separates if the error was thrown due to a resource not existing or due to some other database error
const handleQueryErr = (err) => {
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
//Takes an array of queries that return promises and can take database-services.js functions as part of the array
//Handles any errors encountered and rolls back any queries in case of a failure
//********does not work in case of a database error such as being shut off */
const batchQuery = (queryArray) => {
    return db.tx(t => {
        return t.batch(queryArray);
    }).catch(err => handleTransactionErr(err));
};

//Exports functions to be used in other modules
module.exports = {
    handleTransactionErr,
    handleQueryErr,
    batchQuery
};

