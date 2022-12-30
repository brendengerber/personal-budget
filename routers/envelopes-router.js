//Imports necessary modules
const express = require('express');
const envelopes = require('../envelopes.js');
const {validateEnvelope, validateIdParameter} = require('../custom-middleware/validation-functions.js');
const {checkEnvelopeById, addEnvelope, attatchEnvelopeById, assignEnvelopeId, deleteEnvelopeById, updateEnvelopeById} = require('../custom-middleware/database-functions.js');

//Creates the router
const envelopesRouter = express.Router();

envelopesRouter.param('id', validateIdParameter('id'));
envelopesRouter.param('from', validateIdParameter('fromId'))
envelopesRouter.param('to', validateIdParameter('toId'))

envelopesRouter.get('/', (req, res, next) => {
    res.send(envelopes);
});

envelopesRouter.post('/', validateEnvelope, assignEnvelopeId, addEnvelope, (req, res, next) => {
    res.send(req.envelope);
});

envelopesRouter.get('/:id', checkEnvelopeById, attatchEnvelopeById, (req, res, next) => {
    console.log(req.id)
    res.send(req.envelope);
});

envelopesRouter.put('/:id', validateEnvelope, checkEnvelopeById, updateEnvelopeById, attatchEnvelopeById, (req, res, next) => {
    res.send(req.envelope);
})

envelopesRouter.delete('/:id', checkEnvelopeById, deleteEnvelopeById, (req, res, next) => {
    res.send({message: `Envelope with id: ${req.id} has been deleted.`});
});

envelopesRouter.post('/:from/:to', (req, res, next) => {

})

//Exports the router
module.exports = envelopesRouter;

//move checkenvelopebyid to param? and add function wrapper to validate and check so it can be used for various ids.  The outter function can take the variable that will be the forth variable of the inner param funcint


//does attatching the id variable attatch to req.id or req.to, req.from, req.id? change the last arg to test and see if you can still console log req.id
//add a fourth parameter to checkenvelopebyid("to") which will be which property to check, then in the function req[id/to/from] 