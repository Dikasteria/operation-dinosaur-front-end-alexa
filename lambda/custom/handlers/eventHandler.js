const API = require('../utils/apiUtils')
const Alexa = require("ask-sdk-core");

const EventIntentHandler = {
    canHandle( {requestEnvelope} ) {
        return (
          Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
          Alexa.getIntentName(requestEnvelope) === "EventIntent"
        );
    },
    async handle({ requestEnvelope, responseBuilder }) {
        const { user_id } = requestEnvelope.session.user
        const { event: {value: event} } = requestEnvelope.request.intent.slots
        const result = await API.postEvent(user_id, { event })
        const speakOut = (result) ? 
        `I've made a note of that ${event}`
        :"Sorry, i couldn't make a note of that. Please try again"
        return responseBuilder
          .speak(speakOut)
          .getResponse();
    }
}

module.exports = EventIntentHandler