const axios = require("axios");
const baseUrl = "https://medirep-api.herokuapp.com/api";

const getMedicationList = async (amazonid ) => {
    const { data: { meds } } = await axios.get(`${baseUrl}/meds/alexa`, {headers: { amazonid }})
    return meds
}

const postQuizAnswers = async (amazonid, quizAnswers) => {
    console.log(quizAnswers, amazonid)
    const { data: { confirmation }} = await axios.post(`${baseUrl}/quiz/alexa`, quizAnswers, {headers: { amazonid }});
    return confirmation
}

// TODO: is this the correct endpoint?
// TODO: What does the response look like?
const postHandShakeCode = async (amazonid, inputCode) => {
    const { data: { confirmation } } = await axios.post(`${baseUrl}/codes/alexa`, { inputCode }, { headers: {amazonid} })
    return confirmation
}

// TODO: get the right endpoint. 
// TODO: What does the response look like?
const postMedsTaken = async ( amazonid ) => {
    const payload = {} // TODO: what does the backend want the payload to look like?
    const { data: { confirmation, message } } = await axios.post(`${baseUrl}/meds/alexa`, { payload }, { headers: {amazonid} })
    return {confirmation, message}
}

const deviceIsPairedCheck = async ( amazonid ) => {
    const { data: { confirmation }} = await axios.get(`${baseUrl}/devices/alexa`, { headers: { amazonid } } )
    return confirmation
} 
module.exports = {
    // postEvent,
    deviceIsPairedCheck,
    getMedicationList,
    postQuizAnswers,
    postHandShakeCode,
    postMedsTaken
}