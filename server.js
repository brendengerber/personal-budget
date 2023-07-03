//*********Copy this to the google doc? is it better ordering than that one? */

//Imports necessary modules
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config.js');

const app = express();

//Remove after development to minimize unnecessary realtime logs on server
app.use(morgan('tiny'));

//Security measures
app.use(helmet());
app.disable('x-powered-by');

//Parses request bodies to json
app.use(express.json());

//Mounts the api router
const apiRouter = require('./api-router.js');
app.use('/api', apiRouter);
 
//Sets and serves the static folder, remove html extension from url
app.use(express.static(`${__dirname}/public`, {extensions: ['html']}));
 
//Catch all to send all requests that are not defined by http methods to index.html
app.get('/*', (req, res, next) => {
    res.sendFile(`${__dirname}/public/index.html`);
  });  

//Sets the port and starts the server
const PORT = process.env.PORT || config.port;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
  
