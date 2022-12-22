//Imports necessary modules
const express = require('express');

//Creates the router
const apiRouter = express.Router();

//Mounts the envelopesRouter
const envelopesRouter = require('./routers/envelopes-router.js');
apiRouter.use('/envelopes', envelopesRouter)

//Exports the router
module.exports = apiRouter;