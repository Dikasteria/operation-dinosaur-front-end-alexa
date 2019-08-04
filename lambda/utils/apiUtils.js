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

const postQuizAnswers = async (user_id, quizAnswers) => {
    const { data: { quiz }} = await axios.post(`${baseUrl}/quiz/${user_id}`, {...quizAnswers});
    return quiz
}

// TODO: is this the correct endpoint?
// TODO: What does the response look like?
const postHandShakeCode = async (user_id, inputCode) => {
    const { data } = await axios.post(`${baseUrl}/code/${user_id}`, { inputCode })
    return data
}

// TODO: get the right endpoint. 
// TODO: What does the response look like?
const postMedsTaken = async (user_id) => {
    const payload = {} // TODO: what does the backend want the payload to look like?
    const { data } = await axios.post(`${baseUrl}/meds/${user_id}`, { payload })
    return data
}

module.exports = {
    getMedicationList,
    postQuizAnswers,
    postHandShakeCode,
    postMedsTaken
}