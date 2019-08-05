const utils = require('../utils/Utils');
const API = require('../utils/apiUtils');

const newReminderIntentHandler = async (handlerInput) => {
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
    .speak('Reminders are up to date. Would you like to do anything else?')
    .reprompt('Can I help you with anything else?')
    .getResponse()
}


export default {
    newReminderIntentHandler
}