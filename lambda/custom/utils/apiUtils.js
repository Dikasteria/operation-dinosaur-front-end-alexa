const axios = require("axios");
const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = async (amazonid) => {
    const { data: { meds } } = await axios.get(`${baseUrl}/meds/alexa`, {headers: {amazonid}})
    return meds
}

const postQuizAnswers = async (amazonid, quizAnswers) => {
    const { data: { quiz }} = await axios.post(`${baseUrl}/quiz/alexa`, { data: {quizAnswers}, headers: {amazonid}});
    return quiz
}

// TODO: is this the correct endpoint?
// TODO: What does the response look like?
const postHandShakeCode = async (amazonid, inputCode) => {
    const { data } = await axios.post(`${baseUrl}/codes/alexa`, { data: {inputCode}, headers: {amazonid} })
    return data
}

// TODO: get the right endpoint. 
// TODO: What does the response look like?
const postMedsTaken = async (amazonid) => {
    const payload = {} // TODO: what does the backend want the payload to look like?
    const { data } = await axios.post(`${baseUrl}/meds/alexa`, { data: {payload}, headers: {amazonid} })
    return data
}

module.exports = {
    // postEvent,
    getMedicationList,
    postQuizAnswers,
    postHandShakeCode,
    postMedsTaken
}