const API = require('../utils/apiUtils')
const Alexa = require("ask-sdk-core");

const medsTakenHandler = {
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "medsTakenIntent"
    );
  },
  async handle(handlerInput) {
    const { userId } = handlerInput.requestEnvelope.session.user
    const {confirmation, message} = await API.postMedsTaken(userId)
    const speakOut = confirmation ? message : "I'm sorry. I could not log that you've taken your medication.";
    return handlerInput.responseBuilder
      .speak(speakOut)
      .reprompt('can i help you with anything else?')
      .getResponse()
  }
}

module.exports = medsTakenHandler