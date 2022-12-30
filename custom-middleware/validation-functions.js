//Validation functions will add reqest bodies and parameters as custom properties to the req object.
//This will allow for consistency and for middleware down the chain to use the data knowing it is clean and properly formatted.

//Validates the envelope format for post requsts and attatches it to req.envelope
const validateEnvelope = (req, res, next) => {
    try{
        if(typeof(req.body.budget) === 'number' && typeof(req.body.category) === 'string'){
            req.envelope = req.body;
            next();
        }else{
            res.status(400).send({message: 'Invalid envelope format'});
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
                res.status(400).send({message: `Sorry ${test} is an invalid ID`});
            }
        }catch(err){
            res.status(500).send(err);
        }
    };
}
  
    


// // Validates an ID ensuring it is a number
// const validateIdParameter = (req, res, next, id) => {
//     try{
//         const convertedId = Number(id);
//         if(!Number.isNaN(convertedId)){
//             req.id = convertedId;
//             next();
//         }else{
//             res.status(400).send({message: `Sorry ${test} is an invalid ID`});
//         }
//     }catch(err){
//         res.status(500).send(err);
//     }
// };

module.exports = {
    validateEnvelope,
    validateIdParameter
};

