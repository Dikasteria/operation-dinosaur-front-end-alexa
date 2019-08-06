const Alexa = require("ask-sdk-core");
const user_id = 'a1234'; // TODO: has to be an amazon ID
const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];
const utils = require('./utils/Utils')
const API = require('./utils/apiUtils')
const handlers = require('./handlers/index')
const quizTime = '15:00' // TODO this needs to come from the backend at some point

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
      );
    },
    async handle(handlerInput) {
    const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
    const { responseBuilder } = handlerInput
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

const QuizIntentHandler = {
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "QuizIntent"
    );
  },
  async handle(handlerInput) {
    return handlers.quizHandler(handlerInput)
  }
};

const PairDeviceIntentHandler = { // TODO: pull this into it's own file. It's huge! 
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "PairDeviceIntent"
    );
  },
  async handle(handlerInput) {
    const { requestEnvelope } =handlerInput 
    const pairDeviceCode = requestEnvelope.request.intent.slots.pairDeviceCode.value;
    const response = await API.postHandShakeCode(user_id, value) // TODO: Logic to give user feedback if handshake was successful
    return handlerInput.responseBuilder.speak(pairDeviceCode).getResponse();
  }
};

const newReminderIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'newReminderIntent';
  },
  handle(handlerInput) {
    return handlers.newReminderHandler(handlerInput)
  }
};

const medsTakenHandler = {
  canHandle({ requestEnvelope }) {
    return (
      Alexa.getRequestType(requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(requestEnvelope) === "medsTakenIntent"
    );
  },
  handle(handlerInput) {
    return handlers.medsTakenHandler(handlerInput)
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "I'm here to help you keep track of your medication and health. Try saying take a quiz.";
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const speakOutput = "Goodbye!";
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      "SessionEndedRequest"
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
    );
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    const speakOutput = `You just triggered ${intentName}`;
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`~~~~ Error handled: ${error.stack}`);
    const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    QuizIntentHandler,
    PairDeviceIntentHandler,
    newReminderIntentHandler,
    medsTakenHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(ErrorHandler)
  .withCustomUserAgent(`Hayley_smells/v1`)
  .lambda();