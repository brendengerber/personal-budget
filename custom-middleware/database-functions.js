//Imports envelopes
const envelopes = require('../envelopes.js');

//Adds an envelope
const addEnvelope = (req, res, next) => {
    try{
        envelopes.push(req.envelope);
        next();
    }catch (err){
        res.status(500).send(err)
    }
};

//Finds a certain envelope by ID and attatches it to the req object
const findEnvelopeById = (req, res, next) => {
    try{
        for(envelope of envelopes){
            if(req.id === envelope.id){
                req.envelope = envelope
                return next();
            }
        }
        res.status(404).send('No envelope with that id exists')
    }catch(err){
        res.status(500).send(err)
    }
}

const deleteEnvelopeById = (req, res, next) => {

}

const replaceEnvelopeById = (req, res, next) => {
    
}

module.exports = {
    addEnvelope,
    findEnvelopeById,
    deleteEnvelopeById,
    replaceEnvelopeById
};