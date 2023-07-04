//Imports necessary modules
const validator = require('validator');

//Validates the budget properties of submitted entries to ensure that they conforms to the xxxx.xx currency format
//"budget" is a string to validate
const validateBudget = function(budget){
    try{
        if(typeof budget !== 'string'){
            return undefined;
        };
        if(!validator.isCurrency(budget, {thousands_separator: '', require_decimal: true, digits_after_decimal: [2]}) || isNaN(price)){
            return false;
        };
        return true;
    }catch(err){
        throw err;
    }
};

//Validates a submitted id using a regular expression to ensure it conforms to the v4 UUID standard
//"id" is a string to validate
const validateId = function(id){
    try{
        if(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id)){
            return true;
        }
        return false;
    }catch(err){
        throw err;
    }
};

//Exports functions to be used in other modules
module.exports = {
    validateBudget,
    validateId
};