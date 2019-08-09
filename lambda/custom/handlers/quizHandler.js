const API = require('../utils/apiUtils')
const Alexa = require("ask-sdk-core");

const QuizIntentHandler = {
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "QuizIntent"
    );
  },
  async handle(handlerInput) {
    const userId = handlerInput.requestEnvelope.session.user.userId
    const { mood: {value: mood}, stiffness: {value: stiffness}, slowness: {value: slowness}, tremor: {value: tremor}} = handlerInput.requestEnvelope.request.intent.slots
    const quizAnswers = { mood, stiffness, slowness, tremor };
    const quiz = await API.postQuizAnswers(userId, {...quizAnswers})
    const speakOut = (quiz) ? 
    'Your answers have been recorded'
    :'Sorry, your answers could not be recorded. Please try again.'
    return handlerInput.responseBuilder
      .speak(speakOut)
      .getResponse();
  }
};


module.exports = QuizIntentHandler
