fix transfer budget syntax, something with +- maybe?
test that it is getting caught by turning database off, and see if server crashes or not (it doesnt for simple stuff, only seems to for batches, some promise not being caught)
test first with only one update, to see if it's the update, then make it a batch (could be batch function or batch error function causing isue)
currently some promise is not being caught
try with another midelware that uses the transaction error catching to see where the issues is
the error isnt being passed to the error handling utilities (no test logs showing)
server off catches on singles but crashes on batch
something about throwing 2 errors during the batch
//handleQueryError works even without throwing the err, so probably the problem is not in the utilities
**It seems the problem is when passing promises as the arguments


// adding transaction works but has wierd null result
//can addTransactionAndSubtractBudgetFromEnvelope be made more generic using arguments instead of hard coded sql?


adding purchase time to date for some reason when posting















LATER

// env file?

// update should not update if property is null

//**********New purchases that contain an envelope that doesnt exist get a foreign key error instead of envelope doesnt exist

// add a monthly budget and a remaining budget to envelope
// then make the server reset the budget values at the end of the month
// or have four tables current envelopes, some kind of reset envelopes, current transactions, archived transactions? thats a lot of worky tho










// testing

// POST
// check with id (should fail)
// check without id

// PUT
// check with matching valid id 
// check with matching invalid id (should fail)
// check with mismatching id (should fail)
// check with no id (should fail)
// check with invalid id param (should fail)
// check null values don't update

// GET all

// GET all transactions
// check with existing valid id 
// check with unexisting valid id (should fail)
// check with invalid id (should fail)

// GET by id
// check with existing valid id 
// check with unexisting valid id (should fail)
// check with invalid id (should fail)

// Delete
// check with existing valid id 
// check with unexisting valid id (should fail)
// check with invalid id (should fail)

// test receipts and envelopes one at a time making one property invalid and then omitting that property to make sure the errors catch






