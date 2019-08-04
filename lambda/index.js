const Alexa = require("ask-sdk-core");
const baseUrl = "https://medirep-api.herokuapp.com/api";
const user_id = 1; // TODO: has to be an amazon ID
const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];
const utils = require('./utils/Utils')
const API = require('./utils/apiUtils')
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
          .withAskForPermissionsConsentCard(["alexa::alerts:reminders:skill:readwrite"])
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
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "QuizIntent"
    );
  },
  async handle(handlerInput) {
    const { mood: {value: mood}, stiffness: {value: stiffness}, slowness: {value: slowness}, tremor: {value: tremor}} = handlerInput.requestEnvelope.request.intent.slots
    const quizAnswers = { mood, stiffness, slowness, tremor };
    const quiz = await API.postQuizAnswers(user_id, {...quizAnswers})
    let speakOut = '';
    const speakOut = (quiz && quiz.completed_at) ? 
    'Your answers have been recorded'
    :'Sorry, your answers could not be recorded. Please try again.'
    return handlerInput.responseBuilder
      .speak(speakOut)
      .getResponse();
  }
};

const PairDeviceIntentHandler = { // TODO: pull this into it's own file. It's huge! 
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "PairDeviceIntent"
    );
  },
  async handle(handlerInput) {
    const { requestEnvelope } =handlerInput 
    const pairDeviceCode = requestEnvelope.request.intent.slots.pairDeviceCode.value;
    const respose = await API.postHandShakeCode(user_id, value) // TODO: Logic to give user feedback if handshake was successful
    return handlerInput.responseBuilder.speak(pairDeviceCode).getResponse();
  }
};

const newReminderIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'newReminderIntent';
  },
  async handle(handlerInput) {
      const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
      const requestEnvelope = handlerInput.requestEnvelope;
      const responseBuilder = handlerInput.responseBuilder;
      const permissions = requestEnvelope.context.System.user.permissions
      if (!permissions) {
        // if no permissions, nag the user to grant them
        return responseBuilder
          .speak('I need permission to create reminders. Take a look at your alexa app to grant them.')
          .withAskForPermissionsConsentCard(PERMISSIONS)
          .getResponse()
      }
      switch (requestEnvelope.request.intent.confirmationStatus) {
        case 'CONFIRMED':
          // Alexa confirmed intent, so clear to create reminder
          break;
        case 'DENIED':
          // Alexa disconfirmed the intent; not creating reminder
          return responseBuilder
            .speak(`Ok, I will not create any reminders`)
            .reprompt('')
            .getResponse();
        default:
          //delegate back to Alexa to get confirmation
          return responseBuilder
            .addDelegateDirective()
            .getResponse();
      }
      try {
        // TODO: delete reminders that are not required according to the schedule. Nuclear option?
          const meds = await API.getMedicationList(user_id)
          const { alerts: presentReminders } = await client.getReminders();
          const filteredMeds = utils.filterMedsAgainstExistingReminders(meds, presentReminders)
          const medsReminders = utils.reminderBuilder(filteredMeds)
          medsReminders.forEach(async reminder => {
            await client.createReminder(reminder).then(console.log)
          })
          const quiz = await utils.checkForQuizReminder(presentReminders, quizTime) // TODO: patch existing quiz reminder if time changed
          if (!quiz) {
            const quizReminder = utils.createQuizReminder(quizTime)
            await client.createReminder(quizReminder).then(console.log)
          }
      } catch (error) {
        if (error.name !== 'ServiceError') {
          console.log(`error: ${error.stack}`);
          return responseBuilder
            .speak(`Something went wrong with the reminders`)
            .getResponse();
        }
        throw error;
      }
    return responseBuilder
      .speak(`Reminders are up to date`)
      .getResponse()
  }
};

const medsTakenHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "medsTakenIntent"
    );
  },
  async handle(handlerInput) {
    const result = await API.postMedsTaken(user_id)
    const speakOut = result ?
    "Ok,  i've logged that you've taken your medication."
    : "I'm sorry. I could not log that you've taken your medication."  
    handlerInput.responseBuilder()
      .speak(speakOut)
      .getResponse()
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
    const speakOutput = "I'm here to help you track of your medication and health. Try saying take a quiz.";
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
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
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