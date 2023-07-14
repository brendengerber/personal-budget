//Logic to handle an error thrown by a database transaction
//This function separates if the error was thrown due to a resource not existing or due to some other database error
const handleTransactionErr = (err) => {
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
};


//Exports functions to be used in other modules
module.exports = {
    handleTransactionErr
};

