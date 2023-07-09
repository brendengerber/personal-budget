//Imports necessary modules
const validator = require('validator');
const Schema = require('validate');

//Validates the budget properties of submitted entries to ensure that they conforms to the xxxx.xx currency format
//"budget" is a string to validate
const validateMoney = function(money){
    try{
        if(validator.isCurrency(money.toString(), {thousands_separator: '', digits_after_decimal: [0, 1, 2]})){
            return money;
        }else{
            const err = new Error(`Error: the budget ${money} does not follow the xxxx.xx currency format.`);
            err.status = 400;
            throw err;
        }
    }catch(err){
        throw err;
    }
};

//Validates a submitted id using a regular expression to ensure it conforms to the v4 UUID standard
//"id" is a string to validate
const validateId = function(id){
    try{
        if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
            return id;
        }else{
            const err = new Error(`Error: the request ID ${id} is not a valid v4 UUID.`);
            err.status = 400;
            throw err;
        }
    }catch(err){
        throw err;
    }
};

//Creates a schema to validate Envelope objects
const envelopeSchema = new Schema({
    id: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true    
    }
}, {strict: true});

//Validates an envelope object
//First argument is an envelope object to validate
//Second argument is an optional id if you want to test that the envelope in question matches a certain id (i.e. an id sent via parameters etc)
//Can be used to validate existing envelopes with assigned v4 UUID or new envelopes awaiting assignment
//Successfully validated envelope will conform to {id: v4 UUID string/undefined, category: string, budget: xxx.xx number}
const validateEnvelope = function(envelope, id){
    try{
        let validationErrors;
        //Validates the format of the envelope and sets validationErrors equal to the array of errors if any
        validationErrors = envelopeSchema.validate(envelope);

        //Checks that the body id property is a valid v4 UUID if it exists
        try{
            if(envelope.id){
                validateId(envelope.id);
            }
        }catch(err){
            validationErrors.push(err.message);
        }

        //Checks that the id matches any parameter id
        if(envelope.id && id){
            if(envelope.id !== id){
                validationErrors.push('Error: there is an id mismatch.');
            }
        }

        //Adds the id if not included in the envelope (i.e. from a parameter etc or undefined if it doesn't exist)
        if(!envelope.id){
            envelope = {'id': id, ...envelope};
        }

        //Checks that the budget follows the xxxx.xx format
        try{
            validateMoney(envelope.budget)
        }catch(err){
            validationErrors.push(err.message);
        }

        //Checks if any errors have been recorded and if not, returns the envelope
        if(validationErrors.length === 0){
            return envelope;

        //In case of errors, creates and throws a new error object describing all invalid formatting
        }else{
            const err = new Error(`The envelope format is invalid.\n ${validationErrors.join("\n")}`);
            err.status = 400;
            throw err;
        }

    //Catches and throws any other unforseen errors
    }catch(err){
       throw err;
    }
};

//Exports functions to be used in other modules
module.exports = {
    validateMoney,
    validateId,
    validateEnvelope
};
