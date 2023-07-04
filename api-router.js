//Imports necessary modules
const express = require('express');

//Creates the router
const apiRouter = express.Router();

//Mounts the envelopesRouter
const envelopesRouter = require('./routers/envelopes-router.js');
apiRouter.use('/envelopes', envelopesRouter);

//Handles errors
apiRouter.use((err, req, res, next) => {
    if(!err.status){
      err.status = 500;
    }
    res.status(err.status).send(err.message);
  });

//Exports the router
module.exports = apiRouter;