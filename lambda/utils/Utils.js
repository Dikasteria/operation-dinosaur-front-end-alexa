const getTimeFromUTCString = (string) => {
    return string.match(/\d{2}\:\d{2}/)[0]
}



const reminderBuilder = (meds) => {
    class Reminder {
        constructor({due, type}) {
            this.trigger = {
                type : "SCHEDULED_ABSOLUTE",
                timeZoneId : "Europe/London",
                scheduledTime : `2019-08-02T${getTimeFromUTCString(due)}:00.000`,
                recurrence : {                     
                    freq : "DAILY"                
                }
            }
            this.alertInfo = {
                    spokenInfo: {
                        content: [{
                            locale: "en-GB", 
                            text: `It's time to take your ${type}. Don't forget to log that you've taken these. Say open Diary app and then: I've taken my meds`
                        }]
                    }
            }
            this.pushNotification = {                            
                status : "DISABLED"
            }
        } 
    }
    return meds.map(med => {
        return new Reminder(med)
    })
}

const filterMedsAgainstExistingReminders = (meds, presentReminders) => {
    const filteredMeds = meds.filter(({type, due}) => {
        let filterThisReminder = true
        presentReminders.forEach(({alertInfo: {spokenInfo: {content: [{ text }]}}, trigger: { scheduledTime }, status }) => {
            if (`It's time to take your ${type}. Don't forget to log that you've taken these. Say open Diary app and then: I've taken my meds` === text
                && getTimeFromUTCString(due) === getTimeFromUTCString(scheduledTime)
                && status === 'ON') {
                    filterThisReminder = false
                }
            })
            return filterThisReminder
    })
    return filteredMeds
}

const createQuizReminder= (time) => {
    return {
        trigger : {
            type : "SCHEDULED_ABSOLUTE",
            timeZoneId : "Europe/London",
            scheduledTime : `2019-08-02T${getTimeFromUTCString(time)}:00.000`,
            recurrence : {                     
                freq : "DAILY"                
            }
        },
        alertInfo : {
                spokenInfo: {
                    content: [{
                        locale: "en-GB", 
                        text: `Please take your quiz. Say: Open Diary App and then Take Quiz`
                    }]
                }
        },
        pushNotification : {                            
            status : "DISABLED"
        }
    } 
}

module.exports = {
    createQuizReminder,
    reminderBuilder,
    filterMedsAgainstExistingReminders
} 