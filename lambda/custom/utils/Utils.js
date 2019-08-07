const API = require('./apiUtils')

const getTimeFromUTCString = (string) => {
    return string.match(/\d{2}\:\d{2}/)[0]
}

class Reminder {
    constructor(time, text) {
        this.trigger = {
            type : "SCHEDULED_ABSOLUTE",
            timeZoneId : "Europe/London",
            scheduledTime : `2019-08-02T${getTimeFromUTCString(time)}:00.000`,
            recurrence : {                     
                freq : "DAILY"                
            }
        }
        this.alertInfo = {
                spokenInfo: {
                    content: [{
                        locale: "en-GB", 
                        text
                    }]
                }
        }
        this.pushNotification = {                            
            status : "DISABLED"
        }
    } 
}

const reminderBuilder = (meds) => {
    return meds.map(({due, type}) => {
        const text = `It's time to take your ${type}. Don't forget to log that you've taken these. Say open Diary app and then: I've taken my meds`
        return new Reminder(due, text)
    })
}

const createQuizReminder= (time) => {
    return new Reminder(time, 'Please take your quiz. Say: Open Diary App and then Take Quiz')
}

const checkForExistingReminder = (reminders, text, time) => {
    let reminderPresent = false
    reminders.forEach(({alertInfo: {spokenInfo: {content: [{ text: reminderText }]}}, trigger: { scheduledTime }, status }) => {
        if (text === reminderText && time === getTimeFromUTCString(scheduledTime) && status === 'ON')
            { reminderPresent = true }
        })
    return reminderPresent
}

const checkForQuizReminder = (reminders, time) => {
        const text = 'Please take your quiz. Say: Open Diary App and then Take Quiz'
        return checkForExistingReminder(reminders, text, time)
}

const filterMedsAgainstExistingReminders = (meds, presentReminders) => {
    return meds.filter(({type, due, status}) => {
        if (status !== 5) {
            const text = `It's time to take your ${type}. Don't forget to log that you've taken these. Say open Diary app and then: I've taken my meds`
            const time = getTimeFromUTCString(due)
            return !checkForExistingReminder(presentReminders, text, time)
        }
        return false
    })
}
// TODO tidy this up into a pure function
const checkIfRemindersAreUpToDate = (userId, time, client) => {
    return Promise.all([API.getMedicationList(userId), client.getReminders()])
    .then(([meds, {alerts: presentReminders}])=>{
      const filteredMeds = filterMedsAgainstExistingReminders(meds, presentReminders)
      console.log(checkForQuizReminder(presentReminders, time))
      return (filteredMeds.length === 0 && checkForQuizReminder(presentReminders, time))
    })
}


module.exports = {
    createQuizReminder,
    reminderBuilder,
    checkForQuizReminder,
    filterMedsAgainstExistingReminders,
    checkIfRemindersAreUpToDate,
    checkForExistingReminder,
} 