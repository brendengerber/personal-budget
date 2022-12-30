//Imports necessary modules
const express = require('express');
const envelopes = require('../envelopes.js');
const {validateEnvelope, validateIdParameter} = require('../custom-middleware/validation-functions.js');
const {checkEnvelopeById, addEnvelope, attatchEnvelopeById, assignEnvelopeId, deleteEnvelopeById, updateEnvelopeById} = require('../custom-middleware/database-functions.js');

//Creates the router
const envelopesRouter = express.Router();

envelopesRouter.param('id', validateIdParameter);

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

envelopesRouter.post('/', validateEnvelope, assignEnvelopeId, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.get('/:id', checkEnvelopeById, attatchEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.put('/:id', validateEnvelope, checkEnvelopeById, updateEnvelopeById, attatchEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
})

envelopesRouter.delete('/:id', checkEnvelopeById, deleteEnvelopeById, (req, res, next) => {
    res.send({message: 'Envelope deleted.'});
});

envelopesRouter.post('/:from/:to', (req, res, next) => {

})

//Exports the router
module.exports = envelopesRouter;


