//ADD ERROR CATCHING MIDDLEWARE

MORE COMPLEX CODE THAT DOESNT WORK FOR SOME REASON

const findEntry = async (table, searchId) => {
    try{
        let result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [searchId], (error, results) => {
            if(error){
                //Returns false if no entry exists so middleware can throw the proper error
                if(error.code === '02000'){
                    return false;
                }
                //Throws any other unexpected errors for middleware to handle
                throw error;
            }
            //Returns the result
            console.log('test2')
            return results.rows[0];
        })
        console.log('result')
        console.log(result)
        return result;
    }catch(err){
        throw err;
    };
};




// Checks if an envelope exists by id, attatches it to the req object, and sends an error if it does not exist
const attatchEnvelopeById =  async (req, res, next) => {
    try{
        //Sets req.envelope to the envelope that corisponds with the id, and is set to false if the resources doesn't exist
        req.envelope =  await findEntry('envelopes', req.id);
        console.log('test')
        console.log(req.envelope)
        if(req.envelope){
            return next()
        }
        res.status(404).send({message: `No envelope with ID ${req.id} exists.`});
    }catch(err){
        res.status(500).send(err.message);
    }
}







add envelope and get envelope etc should use database helper functions instead of having the logic right in the route (i.e. envelpoes.push)
Add sanitation

There should be helper functions for get an envelope/all envelopes
database middleware should take arguments for id, rather than just using req.id. When called in the router it should be delete(req.id), that way if something is changed it wont affect everything and they can be used eaiser for other stuff.




Frontend just sends text? Not article bodies? evident in put, does it send the id or just have the id parameter? instead of changing the whole entry, maybe it should just change the relavant columns, i.e. pull the envelope, update envelope.category and envelope.budget, leave the id, then put it back in envelopes? Then could remove the updateenvelopebudget function and just use update

This would solve the issue about IDs, all would just be req.id
Only time full post is on it is right before sending it to the front end in the send method

transfer budget should probably also be it's own database helper, it can take the column that will be manipulated as an argument, check to make sure it's a number, and send error "Transfers must be of the number type"



ID wont come as part of a form, user's aren't typing that, so it should come as a parameter and then the final object made by combing them before pushing to the table

or should the front end transform the form data before sending? 

should id be sent as a parameter or as a key on the object

https://softwareengineering.stackexchange.com/questions/400595/should-data-transformation-be-on-the-front-or-on-the-back-end-in-this-scenario









**************
FOLLOW CRUD CONVENTION
https://stackoverflow.com/questions/54903043/express-req-params-vs-req-body-json

instead of validating an envelope, validateText and validateNumber. And run those on each of the form data. 
what if someone sends a custom http request though?

********or change to validateEnvelopeForm, then attatch each piece individually req.budget, req.category, and sometimes req.id. then puth them together at the end. and when it's a database push them all however

***
It could also be a class with methods that use the database helpers. such constructor would take the data from the validated properties to create an envelope, the methods would upload stuff to the database. envelope.transferBudget(secondEnvelope) for example


*********
database helper functions
change envelopes to something generic, and have the database as a arg 


*********
include logic for when updating an envelope if one field is left null by the user then it will keep the current database entry

*****************************************************************************************************************
*****************************************************************************************************************
update entry can be cuanged to take what columbs it will change as args, then can remove assemble envelope
Can also check for null here, if null then don't update the column
updateEntryById(id, database, columnsToUpdate)

exe updateEntryById(id, [budget, category])
        queryString (includes the id already)
        for(column of columnArray){
            if(column){
                add req[column] to querry string
            }
        }
        submit querry
(Should also take database as an arg)
(in this way can also eliminate updateEntryBudgetById)
*****************************************************************************************************************
******************************************************************************************************************