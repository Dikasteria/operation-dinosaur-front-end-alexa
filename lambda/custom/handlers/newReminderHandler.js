const utils = require('../utils/Utils');
const Alexa = require("ask-sdk-core");
const API = require('../utils/apiUtils');
const user_id = 'a1234'
const quizTime = '15:00'

const newReminderIntentHandler = {
  canHandle(handlerInput) {
      return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
          && Alexa.getIntentName(handlerInput.requestEnvelope) === 'newReminderIntent';
  },
  async handle({ requestEnvelope, responseBuilder, serviceClientFactory}) {
    const client = serviceClientFactory.getReminderManagementServiceClient();
    const { user_id } = requestEnvelope.session.user
    const { permissions } = requestEnvelope.context.System.user
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
          console.log(medsReminders)
          const quiz = await utils.checkForQuizReminder(presentReminders, quizTime)
          if (!quiz) {
            const quizReminder = utils.createQuizReminder(quizTime)
            await client.createReminder(quizReminder).then(console.log)
          }
          return responseBuilder
            .speak('reminders are up to date. Can I help you with anything else?')
            .reprompt('can i help you with anything else?')
            .getResponse()
    } 
    catch (error) {
      console.log(error)
      if (error.name !== 'ServiceError') {
        console.log(`error: ${error.stack}`);
        return responseBuilder
          .speak(`Something went wrong with the reminders`)
          .getResponse();
      }
      throw error;
    }
  }
}

module.exports = newReminderIntentHandler
