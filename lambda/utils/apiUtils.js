const axios = require("axios");

// It's one of these three:
// North America: https://api.amazonalexa.com

// Europe: https://api.eu.amazonalexa.com

// Far East: https://api.fe.amazonalexa.com

const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = async (user_id) => {
    const { data: { meds } } = await axios.get(`${baseUrl}/meds/${user_id}`)
    return meds
}
module.exports = {
    getMedicationList
}