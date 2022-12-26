//Checks if a specific envelope exists and calls next if so

//Imports envelopes
const envelopes = require('../envelopes.js');

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