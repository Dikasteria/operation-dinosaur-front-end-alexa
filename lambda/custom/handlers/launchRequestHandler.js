const utils = require('../utils/Utils')
const quizTime = '15:00'
const Alexa = require("ask-sdk-core");

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return (
        Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
        );
      },
      async handle(handlerInput) {
        const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
        const { responseBuilder } = handlerInput
        const user_id = requestEnvelope.session.user.userId
        const requestEnvelope = handlerInput.requestEnvelope;
        const permissions = requestEnvelope.context.System.user.permissions
        if (!permissions) {
          // if no permissions, nag the user to grant them
          return responseBuilder
            .speak('I need permission to create reminders. Take a look at your alexa app to grant them.')
            .withAskForPermissionsConsentCard(PERMISSIONS)
            .getResponse()
          }
        // check reminders...
        const upToDate = await utils.checkIfRemindersAreUpToDate(user_id, quizTime, client)
        const speakOutput = upToDate ? 
        "what would you like me to do"
        : "It looks like there's been a change to your medication schedule. Please say update reminders to alter your reminders accordingly.";
        return responseBuilder
          .speak(speakOutput)
          .reprompt(speakOutput)
          .getResponse();
    }
  };

module.exports = LaunchRequestHandler