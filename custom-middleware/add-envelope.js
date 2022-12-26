const envelopes = require('../envelopes.js');

const addEnvelope = (req, res, next) => {
    try{
        envelopes.push(req.body);
        next();
    }catch (err){
        res.status(500).send(err)
    }
};


module.exports = addEnvelope;
