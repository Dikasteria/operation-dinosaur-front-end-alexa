const newReminderHandler = require('./newReminderHandler')
const quizHandler = require('./quizHandler')
const medsTakenHandler = require('./medsTakenHandler')
const eventHandler = require('./eventHandler')
const pairDeviceHandler = require ('./pairDeviceHandler')
const launchRequestHandler = require ('./launchRequestHandler') 

module.exports = { 
    launchRequestHandler,
    pairDeviceHandler,
    eventHandler,
    newReminderHandler, 
    quizHandler,
    medsTakenHandler
}