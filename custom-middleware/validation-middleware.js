//Validation functions will add reqest bodies and parameters as custom properties to the req object.
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted.

//Imports necessary modules
const {validateId, validateEnvelope, validateBudget} = require('../helper-functions/validation-helper-functions.js');

//Validates the format of an envelope submitted in the req.body and attatches it to req.envelope
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
//For example in the transfer route you can attach one ID to req.fromId and one ID to req.toId
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

//Validates the balance format in req body and attatches it to req.transferBalance
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

