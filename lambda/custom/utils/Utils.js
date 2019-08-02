// const fs = require ('fs')
const countActiveAlerts = (remindersArr) => {
   return remindersArr.reduce((acc, reminder) => {
        if (reminder.status === "ON") return acc + 1
        else return acc
    } , 0)
}

const reminderBuilder = (meds) => {
            class Reminder {
                constructor(med) {
                  this.trigger = {
                      type : "SCHEDULED_ABSOLUTE",
                      timeZoneId : "Europe/London",
                      scheduledTime : '2019-08-02T15:00:00',
                      recurrence : {                     
                        freq : "DAILY"                
                      }
                    }
                  this.alertInfo = {
                        spokenInfo: {
                            content: [{
                                locale: "en-US", 
                                text: `It's time to take your ${med.type}`
                            }]
                        }
                    }
                this.pushNotification = {                            
                        status : "ENABLED"
                }
            }
                 
            }
            return meds.map(med => {
                return new Reminder(med)
            })
}

module.exports = {
    countActiveAlerts,
    reminderBuilder
} 