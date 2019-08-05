const axios = require("axios");
const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = async (amazon_id) => {
    const { data: { meds } } = await axios.get(`${baseUrl}/meds/alexa`, { headers: { amazon_id }})
    return meds
}

const postQuizAnswers = async (amazon_id, quizAnswers) => {
    const { data: { quiz }} = await axios.post(`${baseUrl}/quiz/alexa`, { data: { quizAnswers }, headers: {amazon_id}});
    return quiz
}

const postHandShakeCode = async (amazon_id, inputCode) => {
    const { data: { confirmation } } = await axios.post(`${baseUrl}/codes/alexa`, { data: { inputCode }, headers: {amazon_id} })
    return confirmation
}

const postMedsTaken = async (amazon_id) => {
    const { data: { confirmation } } = await axios.post(`${baseUrl}/meds/alexa`, { headers: {amazon_id} })
    return confirmation
}

module.exports = {
    getMedicationList,
    postQuizAnswers,
    postHandShakeCode,
    postMedsTaken
}