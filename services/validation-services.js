//This file contains validation services that validate user submitted data
//They are kept separate not only to reuse, but also to separate functionality

//Imports necessary modules
const validator = require('validator');
const Schema = require('validate');

//Validates money values to ensure that they conforms to the xxxx.xx currency format and throws an error if not
//Money with either 2, 1, or 0 decimals and no comma separators will validate
//"money" is a string to validate

const validateMoney = function(money){
    if(validator.isCurrency(money.toString(), {thousands_separator: '', digits_after_decimal: [0, 1, 2]})){
        return money;
    }else{
        const err = new Error(`Error: the budget ${money} does not follow the xxxx.xx currency format.`);
        err.status = 400;
        throw err;
    }
};

//Validates an id using a regular expression to ensure it conforms to the v4 UUID standard and throws an error if not
//"id" is a string to validate
const validateId = function(id){
    if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
        return id;
    }else{
        const err = new Error(`Error: the ID ${id} is not a valid v4 UUID.`);
        err.status = 400;
        throw err;
    }
};

//Validates date properties of submitted entries to ensure they conforms to the YYYY-MM-DD date format
//"date" is a string to validate
const validateDate = function(date){
    if(validator.isDate(date, {format: 'YYYY-MM-DD', delimiters: ['-']})){
        return date;
    }else{
        const err = new Error(`Error: the date ${date} does not follow the YYYY-MM-DD date format.`);
        err.status = 400;
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
        type: String,
        required: true    
    }
}, {strict: true});

//Validates an envelope object
//First argument is an envelope object to validate
//Second argument is an optional id if you want to test that the envelope in question matches a certain id (i.e. an id sent via parameters etc)
//Can be used to validate existing envelopes with assigned v4 UUID or new envelopes awaiting assignment
//A successfully validated envelope will conform to {id: v4 UUID string/undefined, category: string, budget: xxxx.xx number}
//If the envelope does not yet have a v4 UUID the id property will be set to undefined
const validateEnvelope = function(envelope, id){
    let validationErrors;
    //Validates the format of the envelope and sets validationErrors equal to an array of errors if any
    validationErrors = envelopeSchema.validate(envelope);
    //Checks that the id is a valid v4 UUID if it exists and adds an error to the array if not
    try{
        if(envelope.id){
            validateId(envelope.id);
        }
    }catch(err){
        validationErrors.push(err.message);
    }
    //Checks that the envelope id matches the provided id (i.e. the one supplied by a parameter etc) and adds an error to the array if not
    if(envelope.id && id){
        if(envelope.id !== id){
            validationErrors.push('Error: there is an id mismatch.');
        }
    }
    //Adds an error to the array in cases where no id is provided (i.e. one hasn't been assigned yet etc), but the envelope contains an id
    if(envelope.id && !id){
        validationErrors.push('Error: there is an id mismatch.');
    }
    //Standardizes the envelope by adding the id if not already included (i.e. from a parameter etc) or sets it to undefined if it doesn't exist
    if(!envelope.id){
        envelope = {'id': id, ...envelope};
    }
    //Checks that the budget follows the xxxx.xx format and adds an error to the array if not
    try{
        validateMoney(envelope.budget);
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
};

//Creates a schema to validate budget objects
const budgetSchema = new Schema({
    budget: {
        type: String,
        required: true    
    }
}, {strict: true});

//Validates a budget object
//A successfully validated budget will conform to {budget: xxxx.xx number}
const validateBudget = function (budget){
    let validationErrors;
    //Validates the format of the budget and sets validationErrors equal to an array of errors if any
    validationErrors = budgetSchema.validate(budget);
    //Checks that the budget follows the xxxx.xx format and adds an error to the array if not
    try{
        validateMoney(budget.budget);
    }catch(err){
        validationErrors.push(err.message);
    }
    //Checks if any errors have been recorded and if not, returns the budget
    if(validationErrors.length === 0){
        return budget;
    //In case of errors, creates and throws a new error object describing all invalid formatting
    }else{
        const err = new Error(`The budget format is invalid.\n ${validationErrors.join("\n")}`);
        err.status = 400;
        throw err;
    }
};

//Creates a schema to validate purchase objects
const purchaseSchema = new Schema({
    id: {
        type: String,
        required: false    
    },
    envelope_id: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    }
}, {strict: true});

//Validates a purchase object
//A successfully validated purchase will conform to {id: v4 UUID string/undefined, envelope_id: v4 UUID string, description: string, amount: xxxx.xx number}
const validatePurchase = function (purchase, id){
    let validationErrors;
    //Validates the format of the purchase and sets validationErrors equal to an array of errors if any
    validationErrors = purchaseSchema.validate(purchase);
    //Checks that the id is a valid v4 UUID if it exists and adds an error to the array if not
    try{
        if(purchase.id){
            validateId(purchase.id);
        }
    }catch(err){
        validationErrors.push(err.message);
    }
    //Checks that the purchase id matches the provided id (i.e. the one supplied by a parameter etc) and adds an error to the array if not
    if(purchase.id && id){
        if(purchase.id !== id){
            validationErrors.push('Error: there is an id mismatch.');
        }
    }
    //Adds an error to the array in cases where no id is provided (i.e. one hasn't been assigned yet etc.), but the purchase contains an id
    if(purchase.id && !id){
        validationErrors.push('Error: there is an id mismatch.');
    }
    //Standardizes the purchase by adding the id if not already included (i.e. from a parameter etc) or sets it to undefined if it doesn't exist
    if(!purchase.id){
        purchase = {'id': id, ...purchase};
    }
    //Checks that the envelope_id is a valid v4 UUID and adds an error to the array if not
    try{
        validateId(purchase.envelope_id);
    }catch(err){
        validationErrors.push(err.message);
    }
    //Checks that the date format is valid and adds an error to the array if not
    try{
        validateDate(purchase.date)
    }catch(err){
        validationErrors.push(err.message)
    }
    //Checks that the amount follows the xxxx.xx format and adds an error to the array if not
    try{
        validateMoney(purchase.amount);
    }catch(err){
        validationErrors.push(err.message);
    }
    //Checks if any errors have been recorded and if not, returns the budget
    if(validationErrors.length === 0){
        return purchase;
    //In case of errors, creates and throws a new error object describing all invalid formatting
    }else{
        const err = new Error(`The purchase format is invalid.\n ${validationErrors.join("\n")}`);
        err.status = 400;
        throw err;
    }
};

//Exports functions to be used in other modules
module.exports = {
    validateMoney,
    validateId,
    validateDate,
    validateEnvelope,
    validateBudget,
    validatePurchase
};
