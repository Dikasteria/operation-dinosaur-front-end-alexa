const PairDeviceIntentHandler = {
    canHandle({ requestEnvelope }) {
      return (
        Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
        Alexa.getIntentName(requestEnvelope) === "PairDeviceIntent"
      );
    },
    async handle(handlerInput) {
      const { requestEnvelope } =handlerInput
      const { user_id } = requestEnvelope.session.user
      const { value: pairDeviceCode } = requestEnvelope.request.intent.slots.pairDeviceCode;
      const response = await API.postHandShakeCode(user_id, pairDeviceCode)
      const speakOut = response ? "pairing sucessful" : "I'm afraid that didn't work, please try again."
      return handlerInput.responseBuilder.speak(speakOut).getResponse();
    }
  };

module.exports = PairDeviceIntentHandler

