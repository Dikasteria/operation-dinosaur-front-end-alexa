import axios from "axios"

// It's one of these three:
// North America: https://api.amazonalexa.com

// Europe: https://api.eu.amazonalexa.com

// Far East: https://api.fe.amazonalexa.com

const baseUrl = "https://medirep-api.herokuapp.com/api";
const amazonReminderURL = 'https://api.amazonalexa.com/v1/alerts/reminders/{id}'

const getRemindersFromAmazon = (user_id) => {
    const {alerts} = axios.get(`${amazonReminderURL}/${user_id}`) 
    return alerts
}

const getMedicationList = (user_id) => {
    const { meds } = axios.get(`${BaseUrl}/meds/${user_id}`)
}

export default {
    getRemindersFromAmazon,
    getMedicationList
}