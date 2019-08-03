const Alexa = require("ask-sdk-core");
const reminderIntentHandler = (handlerInput) => { 
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
        const reminderRequest = {
            trigger: {
                type: 'SCHEDULED_RELATIVE',
                offsetInSeconds: '5',
            },
            alertInfo: {
                spokenInfo: {
                content: [{
                    locale: 'en-GB',
                    text: 'take yo pills',
                }],
                },
            },
            pushNotification: {
                status: 'ENABLED',
            },
            };
            console.log(reminderRequest)
            await client.createReminder(reminderRequest).then(console.log);
    } catch (error) {
            if (error.name !== 'ServiceError') {
            console.log(`error: ${error.stack}`);
            const client = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
            const { alerts } = await client.getReminders();
            const response = responseBuilder.speak(`you now have ${alerts.length}`).getResponse();
            return response;
            }
        throw error;
    }
    // TODO: Get the amazon id from the request header here.
    //   const currentReminders = API.getRemindersFromAmazon(requestEnvelope.session.user.userId)
    //   return responseBuilder.speak(`you now have ${currentReminders.length} reminders`)
    //       .getResponse()
    return responseBuilder.speak("medication reminders are now up to date").getResponse()
}

export default {
    reminderIntentHandler
}