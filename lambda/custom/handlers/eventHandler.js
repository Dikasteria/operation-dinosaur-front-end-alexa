const eventHandler = () => {
    const user_id = handlerInput.requestEnvelope.session.user.userId
    const { event: {value: event} } = handlerInput.requestEnvelope.request.intent.slots
    const result = await API.postEvent(user_id, { event })
    const speakOut = (result) ? 
    `I've made a note of that ${event}`
    :"Sorry, i couldn't make a note of that. Please try again"
    return handlerInput.responseBuilder
      .speak(speakOut)
      .getResponse();
}

module.exports = eventHandler