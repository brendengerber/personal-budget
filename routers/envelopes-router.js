//Imports necessary modules
const express = require('express');
const envelopes = require('../envelopes.js');
const {validateEnvelope, validateIdParameter} = require('../custom-middleware/validation-functions.js');
const {addEnvelope, attatchEnvelopeById, assignEnvelopeId, deleteEnvelopeById, replaceEnvelopeById} = require('../custom-middleware/database-functions.js');

//Creates the router
const envelopesRouter = express.Router();

envelopesRouter.param('id', validateIdParameter);

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

envelopesRouter.post('/', validateEnvelope, assignEnvelopeId, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.get('/:id', attatchEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.delete('/:id', attatchEnvelopeById, deleteEnvelopeById, (req, res, next) => {
    res.send({message: 'Envelope deleted.'});
});

//Exports the router
module.exports = envelopesRouter;