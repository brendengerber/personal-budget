//Imports necessary modules
const express = require('express');
const {validateEnvelopeReq, validateIdParam, validateReqTransferBudget} = require('../custom-middleware/validation-middleware.js');
const {getAllEnvelopes, getEnvelopeById, addEnvelope, updateEnvelopeById, deleteEnvelopeById, transferEnvelopeBudgetByIds} = require('../custom-middleware/envelopes-database-middleware.js');


//Creates the router
const transactionsRouter = express.Router();

//Validates all id parameters
transactionsRouter.param('id', validateIdParam('id'));

transactionsRouter.get('/', )







//Exports the router
module.exports = envelopesRouter;