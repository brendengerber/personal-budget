//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct helper functions with the correct arguments and attatching results to the req object
//Validation functions will add validated req bodies and parameters as custom properties to the req object
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted

//Imports necessary modules
const {validateId, validateEnvelope, validateBudget} = require('../helper-functions/validation-helper-functions.js');

//Validates the format of an envelope submitted in the req.body and attatches it to req.envelope
//A valid envelope will conform to {id: v4 UUID string/undefined, category: string, budget: xxxx.xx number}
const validateEnvelopeReq = (req, res, next) => {
    try{
        req.envelope = validateEnvelope(req.body, req.id);
        next();
    } catch(err){
       next(err);
    }
};

//Validates an ID ensuring it is a number and attatches it to req.customProperty
//This middleware uses a function wrapper so that it can be used even in routes that have multiple IDs such as transfer
//The customProperty argument is a string used to declare where to attach the validated id
//For example the transfer route attaches one Id parameter to req.fromId and one Id parameter to req.toId
const validateIdParam = (customProperty) => {
    return (req, res, next, id) => {
        try{
            req[customProperty] = validateId(id);
            next();
        }catch(err){
            next(err);
        }
    };
};

//Validates the budget format in req body and attatches it to req.transferBalance
//A valid budget will conform to {budget: xxxx.xx number}
const validateReqTransferBudget = (req, res, next) => {
    try{
        req.transferBudget = validateBudget(req.body).budget;
        next();
    }catch(err){
        next(err);
    }
};

module.exports = {
    validateEnvelopeReq,
    validateIdParam,
    validateReqTransferBudget
};

