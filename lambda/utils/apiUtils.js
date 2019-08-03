import axios from "axios"

// It's one of these three:
// North America: https://api.amazonalexa.com

// Europe: https://api.eu.amazonalexa.com

// Far East: https://api.fe.amazonalexa.com

const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = (user_id) => {
    const { meds } = axios.get(`${BaseUrl}/meds/${user_id}`)
}

export default {
    getRemindersFromAmazon,
    getMedicationList
}