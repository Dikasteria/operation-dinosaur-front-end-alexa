const API = require('../utils/apiUtils')
const user_id = 1

const medsTakenHandler = async () => {
    const result = await API.postMedsTaken(user_id)
    const speakOut = result ?
    "Ok,  i've logged that you've taken your medication."
    : "I'm sorry. I could not log that you've taken your medication."  
    handlerInput.responseBuilder()
      .speak(speakOut)
      .getResponse()
}

module.exports = medsTakenHandler