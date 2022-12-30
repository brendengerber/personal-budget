//Validates the envelope format for post requsts
const validateEnvelope = (req, res, next) => {
    try{
        if(typeof(req.body.budget) === 'number' && typeof(req.body.category) === 'string'){
            req.envelope = req.body;
            next();
        }else{
            res.status(400).send({message: 'Invalid envelope format'});
        }
    } catch(err){
       res.status(500).send(err);
    }
};

//Validates an ID ensuring it is a number
const validateIdParameter = (req, res, next, id) => {
    try{
        const convertedId = Number(id);
        if(!Number.isNaN(convertedId)){
            req.id = convertedId;
            next();
        }else{
            res.status(400).send({message: 'Invalid ID'});
        }
    }catch(err){
        res.status(500).send(err);
    }
}

module.exports = {
    validateEnvelope,
    validateIdParameter
};

