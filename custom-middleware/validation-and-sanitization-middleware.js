//Route functionality is kept here in seperate middleware functions to maintain separation of concerns and allow for re-use in multiple routes
//Middleware functions are in charge of calling the correct services with the correct arguments and attatching results to the req object
//Validation functions will add validated req bodies and parameters as custom properties to the req object
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted

//Imports necessary modules
const {check} = require('../services/validation-and-sanitization-services.js');

//Sanitizes and validates the format of an envelope submitted in the req.body and attatches it to req.envelope
//A valid envelope will conform to {id: v4 UUID string/undefined, category: string, budget: xxxx.xx string}
const checkReqEnvelope = (req, res, next) => {
    try{
        req.envelope = check.objects.envelope(req.body, req.envelopeId);
        next();
    } catch(err){
       next(err);
    }
};

//Sanitizes and validates an ID ensuring it is a number and attatches it to req.customProperty
//This middleware uses a function wrapper so that it can be used even in routes that have multiple IDs such as transfer
//The customProperty argument is a string used to declare where to attach the validated id
//For example the transfer route attaches one Id parameter to req.fromId and one Id parameter to req.toId
const checkParamId = (customProperty) => {
    return (req, res, next, id) => {
        try{
            req[customProperty] = check.data.id(id);
            next();
        }catch(err){
            next(err);
        }
    };
};

//Sanitizes and validates the budget format in req body and attatches it to req.transferBalance
//A valid budget will conform to {budget: xxxx.xx number}
const checkReqTransferBudget = (req, res, next) => {
    try{
        req.transferBudget = check.objects.budget(req.body).budget;
        next();
    }catch(err){
        next(err);
    }
};

//Sanitizes and validates the format of a purchase submitted in the req.body and attatches it to req.purchase
//A valid purchase will conform to {id: v4 UUID string/undefined, envelope_id: v4 UUID string, date: YYYY-MM-DD string, description: string, amount: xxxx.xx string}
const checkReqPurchase = (req, res, next) => {
    try{
        req.purchase = check.objects.purchase(req.body, req.purchaseId);
        next();
    }catch(err){
        next(err);
    }

};

module.exports = {
    checkReqEnvelope,
    checkParamId,
    checkReqTransferBudget,
    checkReqPurchase
};

