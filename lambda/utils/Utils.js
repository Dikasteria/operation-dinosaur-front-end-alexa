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
                                text: `It's time to take your ${type}`
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

const filterAgainstExistingReminders = (presentReminders, pending) => {
    const existing = presentReminders.map(({alertInfo: {spokenInfo: {content: [{ text }]}}, trigger: { scheduledTime }, status }) => {
        return {
            text,
            time: getTimeFromUTCString(scheduledTime),
            status
        }
    })
    const filteredReminders = pending.filter(({alertInfo: {spokenInfo: {content: [{ text }]}}, trigger: { scheduledTime }}) => {
        let filterThisReminder = true
        existing.forEach(existingReminder => {
            if (text === existingReminder.text &&
                scheduledTime === existingReminder.time &&
                existingReminder.status === 'COMPLETED') {
                    filterThisReminder = false
                }
            })
        return filterThisReminder
    })
    return filteredReminders
}

module.exports = {
    reminderBuilder,
    filterAgainstExistingReminders
} 