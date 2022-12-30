//Imports envelopes
let envelopes = require('../envelopes.js');

//Checks if an envelope exists by id
const checkEnvelopeById = (req, res, next) => {
    try{
        for(envelope of envelopes){
            if(envelope.id === req.id){
                return next();
            }
        }
        res.status(404).send({message: 'No envelope with that id exists'});
    }catch(err){
        res.status(500).send(err);
    }
}

//Adds an envelope
const addEnvelope = (req, res, next) => {
    try{
        envelopes.push(req.envelope);
        console.log(envelopes)
        next();
    }catch (err){
        res.status(500).send(err);
    }
};

//Finds a certain envelope by ID and attatches it to the req object
const attatchEnvelopeById = (req, res, next) => {
    try{
        for(envelope of envelopes){
            if(req.id === envelope.id){
                req.envelope = envelope;
                next();
            }
        }
    }catch(err){
        res.status(500).send(err);
    }
}

//Assigns an id to the envelope in the req body based on the current highest id
const assignEnvelopeId = (req, res, next) => {
    try{
        let newId;
        if(envelopes.length === 0){
            newId = 1;
        }else{
            newId = envelopes[envelopes.length - 1].id + 1;
        }
        req.envelope.id = newId;
        next();
    }catch(err){
        res.status(500).send(err);
    }
}

const deleteEnvelopeById = (req, res, next) => {
    try{
        for(envelope of envelopes){
            if(envelope.id === req.id){
                envelopes.splice(envelopes.indexOf(envelope), 1);
            }
        }
        next();
    }catch(err){
        res.status(500).send(err);
    }
}

const updateEnvelopeById = (req, res, next) => {
    try{
        envelopes.forEach(function(envelope, i){if (envelope.id === req.id) envelopes[i] = req.envelope;});
        next();
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = {
    checkEnvelopeById,
    addEnvelope,
    attatchEnvelopeById,
    assignEnvelopeId,
    deleteEnvelopeById,
    updateEnvelopeById
};