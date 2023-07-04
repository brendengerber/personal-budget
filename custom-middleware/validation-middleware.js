//Validation functions will add reqest bodies and parameters as custom properties to the req object.
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted.

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
       res.status(500).send(err);
    }
};

//Validates an ID ensuring it is a number and attatches it to req.customProperty
//This middleware uses a function wrapper so that it can be used even in routes that have multiple IDs such as transfer
//The customProperty argument is a string used to declare where to attach the validated id
//For example in the transfer route you can attach one ID to req.fromId and one ID to req.toId
const validateIdParameter = (customProperty) => {
    return (req, res, next, id) => {
        try{
            const convertedId = Number(id);
            if(!Number.isNaN(convertedId)){
                req[customProperty] = convertedId;
                next();
            }else{
                res.status(400).send({message: `Sorry ${id} is an invalid ID.`});
            }
        }catch(err){
            res.status(500).send(err);
        }
    };
}

//Validates the balance format in req body and attatches it to req.transferBalance
const validateTransferBudget = (req, res, next) => {
    try{
        const convertedTransferBudget = Number(req.body.transferBudget);
        if(!Number.isNaN(convertedTransferBudget)){
            req.transferBudget = convertedTransferBudget;
            next();
        }else{
            res.status(400).send({message: `Sorry ${req.body} is an invalid transfer budget.`});
        }
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = {
    validateEnvelopeData,
    validateIdParameter,
    validateTransferBudget
};

