//Imports necessary modules
const express = require('express');
const envelopes = require('../envelopes.js');
const validateEnvelope = require('../custom-middleware/validate-envelope.js');
const assignEnvelopeId = require('../custom-middleware/assign-envelope-Id.js');
const addEnvelope = require('../custom-middleware/add-envelope.js');

//Creates the router
const envelopesRouter = express.Router();

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

envelopesRouter.post('/', validateEnvelope, assignEnvelopeId, addEnvelope, (req, res, next) => {
    res.send(req.body);
});

//Exports the router
module.exports = envelopesRouter;