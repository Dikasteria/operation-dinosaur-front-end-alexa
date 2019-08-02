const Alexa = require("ask-sdk-core");
const axios = require("axios");
const baseUrl = "https://medirep-api.herokuapp.com/api";
const user_id = 1;
const PERMISSIONS = ['alexa::alerts:reminders:skill:readwrite'];
const utils = require('./utils/Utils')


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
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
    const speakOutput = "what would you like me to do";
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
    const mood =
      handlerInput.requestEnvelope.request.intent.slots.mood.value;
    const stiffness =
      handlerInput.requestEnvelope.request.intent.slots.stiffness.value;
    const slowness =
      handlerInput.requestEnvelope.request.intent.slots.slowness.value;
    const tremor =
      handlerInput.requestEnvelope.request.intent.slots.tremor.value;

    const quizAnswers =
      { mood, stiffness, slowness, tremor };

    const response =
      await axios.post(`${baseUrl}/quiz/${user_id}`, {...quizAnswers});

    let speakOut = '';
    if(response.data.quiz && response.data.quiz.completed_at){
      speakOut = 'Your answers have been recorded';
    } else {
      speakOut = 'Sorry, your answers could not be recorded. Please try again.';
    };

    return handlerInput.responseBuilder.speak(speakOut).getResponse();
  }
};

const PairDeviceIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "PairDeviceIntent"
    );
  },
  handle(handlerInput) {
    const pairDeviceCode =
      handlerInput.requestEnvelope.request.intent.slots.pairDeviceCode.value;
    const amazon_id = handlerInput.requestEnvelope.session.user.userId;
    console.log(amazon_id);
    return handlerInput.responseBuilder.speak(pairDeviceCode).getResponse();
  }
};

const newReminderIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'newReminderIntent';
  },
  async handle(handlerInput) {
    // TODO: This needs to read the medication list and make sure that reminders for those items exist in the amazon reminders API
      const requestEnvelope = handlerInput.requestEnvelope;
      const responseBuilder = handlerInput.responseBuilder;
      const consentToken = requestEnvelope.context.System.apiAccessToken;
      const permissions = requestEnvelope.context.System.user.permissions
      if (!permissions) {
        // if no permissions, nag the user to grant them
        return responseBuilder
          .speak('I need permission to create reminders. Take a look at your alexa app to grant them.')
          .withAskForPermissionsConsentCard(["alexa::alerts:reminders:skill:readwrite"])
          .getResponse()
      }
      switch (requestEnvelope.request.intent.confirmationStatus) {
              case 'CONFIRMED':
                console.log('Alexa confirmed intent, so clear to create reminder');
                break;
              case 'DENIED':
                console.log('Alexa disconfirmed the intent; not creating reminder');
                return responseBuilder
                  .speak(`Ok, I will not create any reminders`)
                  .reprompt('')
                  .getResponse();
          case 'NONE':
          default:
            console.log('delegate back to Alexa to get confirmation');
            return responseBuilder
              .addDelegateDirective()
              .getResponse();
        }
      if (!consentToken) {
          return responseBuilder
          .speak("you don't currently have reminders enabled for this skill")
            .withAskForPermissionsConsentCard(PERMISSIONS)
            .getResponse();
        }
        try {
            const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
            axios.get('https://medirep-api.herokuapp.com/api/meds/1')
              .then( async ({data: {meds}}) => {
                console.log(meds)
                const reminderRequest = utils.reminderBuilder(meds)[0]
                console.log(reminderRequest)
                await client.createReminder(reminderRequest).then(console.log);
            })
              .catch(console.log)
      } catch (error) {
              if (error.name !== 'ServiceError') {
                console.log(`error: ${error.stack}`);
                const response = responseBuilder.speak(`Something went wrong with the reminders`).getResponse();
                return response;
              }
              throw error;
            }
            // TODO: Get the amazon id from the request header here.
            //   const currentReminders = API.getRemindersFromAmazon(requestEnvelope.session.user.userId)
            //   return responseBuilder.speak(`you now have ${currentReminders.length} reminders`)
            //       .getResponse()
          const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
          const { alerts } = await client.getReminders();
    return responseBuilder
      .speak(`you now have ${utils.countActiveAlerts(alerts)}`)
      .getResponse()
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const speakOutput = "You can say hello to me! How can I help?";

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
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .withApiClient(new Alexa.DefaultApiClient())
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(RequestLog)
  .addResponseInterceptors(ResponseLog)
  .lambda();