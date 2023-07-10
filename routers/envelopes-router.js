//******************NEEDS STATUS CODES

//Imports necessary modules
const express = require('express');
const {validateEnvelopeReq, validateIdParam, validateReqTransferBudget} = require('../custom-middleware/validation-middleware.js');
const {ruturnAllEnvelopes, findEnvelopeById, addEnvelope, deleteEnvelopeById, updateEnvelopeById, transferEnvelopeBudget} = require('../custom-middleware/database-middleware.js');

//Creates the router
const envelopesRouter = express.Router();

//Validates all id parameters
envelopesRouter.param('id', validateIdParam('id'));
envelopesRouter.param('from', validateIdParam('fromId'));
envelopesRouter.param('to', validateIdParam('toId'));

//Gets all envelopes
//*******************needs refactor to use database */
envelopesRouter.get('/', ruturnAllEnvelopes, (req, res, next) => {
    res.send(req.envelopes);
});

//Gets an envelope with the specified id
envelopesRouter.get('/:id', findEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

//Posts a new envelope and sends the posted envelope along with the newly generated v4 UUID
//Body must be the new envelope in the form of a JSON object: {"category": string, "budget": number,}
envelopesRouter.post('/', validateEnvelopeReq, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

//Updates the envelope with the specified id
//Body must be the new envelope in the form of a JSON object: {"id": string, "category": string, "budget": number,}
envelopesRouter.put('/:id', validateEnvelopeReq, updateEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
});

//Deletes the envelope with the specified id
envelopesRouter.delete('/:id', deleteEnvelopeById, (req, res, next) => {
    res.send({message: `Envelope with ID ${req.id} has been deleted.`});
});

//Transfers the specified budget from the specified envelope to the second specified envelope
//Body must be the transfer amount in the form of a JSON object: {"transferBudget": 2000}
envelopesRouter.put('/:from/transfer/:to', validateReqTransferBudget, transferEnvelopeBudget,(req, res, next) => {
    res.send({message: `The budget of ${req.transferBudget} has been transferred from ID ${req.fromId} to ID ${req.toId}.`});
});

//**********needs refactoring? and it's own middleware */
envelopesRouter.put('/test',(req, res, next) => {
    updateEnvelopeBudget()
    res.send({message: `success`});
});

//Exports the router
module.exports = envelopesRouter;