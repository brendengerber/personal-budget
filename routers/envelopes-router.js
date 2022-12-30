//Imports necessary modules
const express = require('express');
const envelopes = require('../envelopes.js');
const {validateEnvelope, validateId} = require('../custom-middleware/validation-functions.js')
const {addEnvelope, findEnvelopeById, assignEnvelopeId, deleteEnvelopeById, replaceEnvelopeById} = require('../custom-middleware/database-functions.js');

//Creates the router
const envelopesRouter = express.Router();

//Add param here to validate and attatch id first. Should this also find and attatch the envelope in question? Mayhaps (that function is in database functions now)

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

envelopesRouter.post('/', validateEnvelope, assignEnvelopeId, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.delete('/:id', (req, res, next) => {
 //Add logic here
})

//Exports the router
module.exports = envelopesRouter;   