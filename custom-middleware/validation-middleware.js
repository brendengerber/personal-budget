//Validation functions will add reqest bodies and parameters as custom properties to the req object.
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted.

//Imports necessary modules
const {validateBudget, validateId} = require('../helper-functions/validation-helper-functions.js');


//*********************NEEDS REFACTORING TO USE SCHEMA in helper function */
//Validates the envelope format in req body and attatches it to req.envelope
const validateEnvelopeData = (req, res, next) => {
    try{
        //Validates type for each property and the number of properties to disallow objects with incorrect property types or extra properties
        if(typeof(req.body.budget) === 'number' && typeof(req.body.category) === 'string' && Object.keys(req.body).length === 2){
            req.budget = req.body.budget;
            req.category = req.body.category;
            req.envelope = req.body;
            next();
        }else{
            res.status(400).send({message: 'Invalid envelope format.'});
        }
    } catch(err){
       next(err);
    }
};

//Validates an ID ensuring it is a number and attatches it to req.customProperty
//This middleware uses a function wrapper so that it can be used even in routes that have multiple IDs such as transfer
//The customProperty argument is a string used to declare where to attach the validated id
//For example in the transfer route you can attach one ID to req.fromId and one ID to req.toId
const validateIdParameter = (customProperty) => {
    return (req, res, next, id) => {
        try{
            if(validateId(id)){
                req[customProperty] = id;
                next();
            }else{
                const err = new Error(`The request ID ${id} is not a valid v4 UUID.`);
                err.status = 400;
                next(err);
            }
        }catch(err){
            next(err);
        }
    };
};

//Validates the balance format in req body and attatches it to req.transferBalance
const validateTransferBudget = (req, res, next) => {
    try{
        if(validateBudget(req.body.transferBudget)){
//************Does this need to be changed to number? like before? try transferring the same budget twice to see */
            req.transferBudget = req.body.transferBudget;
            next();
        }else{
            res.status(400).send({message: `Sorry ${req.body.transferBudget} is an invalid transfer budget.`});
        }
    }catch(err){
        next(err);
    }
};

module.exports = {
    validateEnvelopeData,
    validateIdParameter,
    validateTransferBudget
};

