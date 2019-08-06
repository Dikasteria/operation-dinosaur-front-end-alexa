const newReminderHandler = require('./newReminderHandler')
const quizHandler = require('./quizHandler')
const medsTakenHandler = require('./medsTakenHandler')
const eventHandler = require('./eventHandler')

module.exports = { 
    eventHandler,
    newReminderHandler, 
    quizHandler,
    medsTakenHandler
}