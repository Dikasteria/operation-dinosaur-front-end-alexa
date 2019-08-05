const API = require('../utils/apiUtils')
const user_id = 1

const quizHandler = async (handlerInput) => {
    const user_id = handlerInput.requestEnvelope.session.user.userId
    const { mood: {value: mood}, stiffness: {value: stiffness}, slowness: {value: slowness}, tremor: {value: tremor}} = handlerInput.requestEnvelope.request.intent.slots
    const quizAnswers = { mood, stiffness, slowness, tremor };
    const quiz = await API.postQuizAnswers(user_id, {...quizAnswers})
    const speakOut = (quiz) ? 
    'Your answers have been recorded'
    :'Sorry, your answers could not be recorded. Please try again.'
    return handlerInput.responseBuilder
      .speak(speakOut)
      .getResponse();
}

module.exports = quizHandler
