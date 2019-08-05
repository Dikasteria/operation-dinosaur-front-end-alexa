const axios = require("axios");

// It's one of these three:
// North America: https://api.amazonalexa.com

// Europe: https://api.eu.amazonalexa.com

// Far East: https://api.fe.amazonalexa.com

const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = async (amazon_id) => {
    const { data: { meds } } = await axios.get(`${baseUrl}/meds/${amazon_id}`, {headers: {amazon_id}})
    return meds
}

const postQuizAnswers = async (amazon_id, quizAnswers) => {
    const { data: { quiz }} = await axios.post(`${baseUrl}/quiz/${amazon_id}`, { data: {quizAnswers}, headers: {amazon_id}});
    return quiz
}

// TODO: is this the correct endpoint?
// TODO: What does the response look like?
const postHandShakeCode = async (amazon_id, inputCode) => {
    const { data } = await axios.post(`${baseUrl}/code/${amazon_id}`, { data: {inputCode}, headers: {amazon_id} })
    return data
}

// TODO: get the right endpoint. 
// TODO: What does the response look like?
const postMedsTaken = async (amazon_id) => {
    const payload = {} // TODO: what does the backend want the payload to look like?
    const { data } = await axios.post(`${baseUrl}/meds/${amazon_id}`, { data: {payload}, headers: {amazon_id} })
    return data
}

module.exports = {
    getMedicationList,
    postQuizAnswers,
    postHandShakeCode,
    postMedsTaken
}