const API = require('../utils/apiUtils')

const medsTakenHandler = {
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "medsTakenIntent"
    );
  },
  async handle(handlerInput) {
    const { user_id } = handlerInput.requestEnvelope.session.user
    const result = await API.postMedsTaken(user_id)
    const speakOut = result ?
    "Ok,  i've logged that you've taken your medication."
    : "I'm sorry. I could not log that you've taken your medication."  
    handlerInput.responseBuilder()
      .speak(speakOut)
      .getResponse()
  }
}

module.exports = medsTakenHandler