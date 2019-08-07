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
        const { userId } = requestEnvelope.session.user
        const { event: {value: event} } = requestEnvelope.request.intent.slots
        // const result = await API.postEvent(userId, { event })
        // const speakOut = (result) ? 
        // `I've made a note of that ${event}`
        // :"Sorry, i couldn't make a note of that. Please try again"
        return responseBuilder
          .speak('hello dave')
          .getResponse();
    }
}

module.exports = EventIntentHandler