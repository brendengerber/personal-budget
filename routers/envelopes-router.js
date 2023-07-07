//Imports necessary modules
const express = require('express');
const {validateEnvelopeData, validateIdParameter, validateTransferBudget} = require('../custom-middleware/validation-middleware.js');
const {attatchEnvelopeById, addEnvelope, assembleEnvelope, deleteEnvelopeById, updateEnvelopeById, transferEnvelopeBudget} = require('../custom-middleware/database-middleware.js');

//Creates the router
const envelopesRouter = express.Router();

//Validates all id parameters
envelopesRouter.param('id', validateIdParameter('id'));
envelopesRouter.param('from', validateIdParameter('fromId'));
envelopesRouter.param('to', validateIdParameter('toId'));

//Gets all envelopes
envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

//Gets an envelope with the specified id
envelopesRouter.get('/:id', attatchEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

//Posts a new envelope
//Body must be the new envelope in the form of a JSON object: {"category": string, "budget": number,}
envelopesRouter.post('/', validateEnvelopeData, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

//Updates the envelope with the specified id
//Body must be the new envelope in the form of a JSON object: {"category": string, "budget": number,}
envelopesRouter.put('/:id', validateEnvelopeData, assembleEnvelope, updateEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

//Deletes the envelope with the specified id
envelopesRouter.delete('/:id', deleteEnvelopeById, (req, res, next) => {
    res.send({message: `Envelope with ID ${req.id} has been deleted.`});
});

//Transfers the specified budget from the specified envelope to the second specified envelope
//Body must be the transfer amount in the form of a JSON object: {"transferBudget": 2000}
envelopesRouter.put('/:from/transfer/:to', validateTransferBudget, transferEnvelopeBudget,(req, res, next) => {
    res.send({message: `The budget of ${req.transferBudget} has been transferred from ID ${req.fromId} to ID ${req.toId}.`});
});

//Exports the router
module.exports = envelopesRouter;