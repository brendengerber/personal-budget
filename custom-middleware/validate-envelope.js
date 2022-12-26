//Validates the envelope format for post requsts

const validateEnvelope = (req, res, next) => {
    try{
        if(typeof(req.body.budget) === 'number' && typeof(req.body.category) === 'string'){
            next();
        }else{
            res.status(400).send({message: 'Incorrect envelope format'});
        }
    } catch(err){
       res.status(500).send(err);
    }
};

module.exports = validateEnvelope;
