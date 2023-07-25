***change to processQueryError
change the database functions to remove error handling
.catch(next(processQueryError(err))); 

or

catch{
    next(processQueryErr(err))
}