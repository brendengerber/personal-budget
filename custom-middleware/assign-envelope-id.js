//Assigns an id to the envelope in the req body based on the current highest id

const envelopes = require('../envelopes.js')

const assignEnvelopeId = (req, res, next) => {
    try{
        const newId = envelopes[envelopes.length - 1].id + 1
        req.body.id = newId
        next()
    }catch(err){
        res.status(500).send(err)
    }
}

module.exports = assignEnvelopeId;
