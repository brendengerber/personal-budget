//Imports necessary modules
const express = require('express');
const {checkReqEnvelope, checkParamId, checkReqTransferBudget} = require('../custom-middleware/validation-and-sanitization-middleware.js');
const {getAllEnvelopes, getEnvelopeById, getEnvelopePurchasesById, addEnvelope, updateEnvelopeById, deleteEnvelopeById, transferEnvelopeBudgetByIds} = require('../custom-middleware/envelopes-database-middleware.js');

//Creates the router
const envelopesRouter = express.Router();

//Validates and sanitizes all id parameters
envelopesRouter.param('id', checkParamId('envelopeId'));
envelopesRouter.param('from', checkParamId('envelopeFromId'));
envelopesRouter.param('to', checkParamId('envelopeToId'));

//Gets all envelopes and sends them as an array
envelopesRouter.get('/', getAllEnvelopes, (req, res, next) => {
    res.status(200).send(req.envelopes);
});

//Gets an envelope with the specified id and sends it
envelopesRouter.get('/:id', getEnvelopeById, (req, res, next) => {
    res.status(200).send(req.envelope);
});

//Gets all purchases associated with the specified envelope
envelopesRouter.get('/:id/purchases', getEnvelopePurchasesById, (req, res, next) => {
    res.status(200).send(req.envelopePurchases);
});

//Posts a new envelope and sends the posted envelope along with the newly generated v4 UUID
//Body must be the new envelope in the form of a JSON object: {"category": v4 UUID string, "budget": xxxx.xx number}
envelopesRouter.post('/', checkReqEnvelope, addEnvelope, (req, res, next) => {
    res.status(201).send(req.envelope);
});

//Deletes the envelope with the specified id and sends it
envelopesRouter.delete('/:id', deleteEnvelopeById, (req, res, next) => {
    res.status(200).send(req.envelopeDeleted);
});

//Updates the envelope with the specified id and sends the newly updated envelope
//Body must be the new envelope in the form of a JSON object: {"id": v4 UUID string, "category": string, "budget": xxxx.xx number} or {"category": string, "budget": xxxx.xx number}
envelopesRouter.put('/:id', checkReqEnvelope, updateEnvelopeById, (req, res, next) => {
    res.status(200).send(req.envelope);
});

//Transfers the specified budget from the specified envelope to the second specified envelope and returns an array of the updated envelopes
//Body must be the transfer amount in the form of a JSON object: {"transferBudget": xxxx.xx number}
envelopesRouter.put('/:from/transfer/:to', checkReqTransferBudget, transferEnvelopeBudgetByIds,(req, res, next) => {
    res.status(200).send(req.updatedEnvelopes);
});

//Exports the router
module.exports = envelopesRouter;