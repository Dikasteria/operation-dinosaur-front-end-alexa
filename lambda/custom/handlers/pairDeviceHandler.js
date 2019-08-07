const API = require('../utils/apiUtils')
const Alexa = require("ask-sdk-core");

const PairDeviceIntentHandler = {
    canHandle({ requestEnvelope }) {
      return (
        Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(requestEnvelope) === "PairDeviceIntent"
      );
    },
    async handle(handlerInput) {
      const { requestEnvelope } = handlerInput
      const { userId } = requestEnvelope.session.user
      let pairDeviceCode = null
      if (requestEnvelope.request.intent && requestEnvelope.request.intent.slots && requestEnvelope.request.intent.slots.pairDeviceCode ) {
        pairDeviceCode = requestEnvelope.request.intent.slots.pairDeviceCode.value
      }
      if (pairDeviceCode) {
        const response = await API.postHandShakeCode(userId, pairDeviceCode)
        console.log(response)
        const speakOut = response ? "pairing sucessful" : "I'm afraid that didn't work, please try again."
        return handlerInput.responseBuilder
          .speak(speakOut)
          .reprompt('Can i help you with anything else?')
          .getResponse();
      } else {
        return handlerInput.responseBuilder
          .speak('It looks like there is no app paired with this device. Please say pair a device to pair an app.')
          .reprompt('It looks like there is no app paired with this device. Please say pair a device to pair an app.')
          .getResponse();
      }
    }
  };

module.exports = PairDeviceIntentHandler

