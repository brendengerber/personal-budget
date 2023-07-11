//Imports database helper functions
const {getAllEntries, getEntry, addEntry, updateEntry, deleteEntry, transferColumnAmount} = require('../helper-functions/database-helper-functions.js');




//Exports the functions for use in other modules
module.exports = {
    getAllEnvelopes,
    getEnvelopeById,
    addEnvelope,
    updateEnvelopeById,
    deleteEnvelopeById,
    transferEnvelopeBudgetByIds
};