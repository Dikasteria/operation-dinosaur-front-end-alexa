const newReminderHandler = require('./newReminderHandler')
const quizHandler = require('./quizHandler')
const medsTakenHandler = require('./medsTakenHandler')
const eventHandler = require('./eventHandler')
const pairDeviceHandler =require ('./pairDeviceHandler')

module.exports = { 
    pairDeviceHandler,
    eventHandler,
    newReminderHandler, 
    quizHandler,
    medsTakenHandler
}