const utils = require('../utils/Utils')
const API = require('../utils/apiUtils')
const quizTime = '15:00'
const Alexa = require("ask-sdk-core");
const PairDeviceIntentHandler = require('./pairDeviceHandler')

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
        );
      },
      async handle(handlerInput) {
        const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        const { responseBuilder } = handlerInput
        const { requestEnvelope } = handlerInput;
        const { userId } = requestEnvelope.session.user
        const permissions = requestEnvelope.context.System.user.permissions
        const isPaired = await API.deviceIsPairedCheck(userId)
        if (!isPaired) {
          return PairDeviceIntentHandler.handle(handlerInput)
        } 
        if (!permissions) {
          // if no permissions, nag the user to grant them
          return responseBuilder
            .speak('I need permission to create reminders. Take a look at your alexa app to grant them.')
            .withAskForPermissionsConsentCard(PERMISSIONS)
            .getResponse()
          }
        // check reminders...
        const upToDate = await utils.checkIfRemindersAreUpToDate(userId, quizTime, client)
        const speakOutput = (upToDate) ? 
        "what would you like me to do"
        : "It looks like there's been a change to your medication schedule. Please say update reminders to alter your reminders accordingly.";
        return responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
  };

module.exports = LaunchRequestHandler