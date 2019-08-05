import { tsModuleBlock } from "@babel/types";

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