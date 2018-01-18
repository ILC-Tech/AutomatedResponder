'use strict'
const http = require('http')
const Bot = require('messenger-bot')
const parse = require('./parse')

let bot = new Bot({
    token: 'EAAPZCNFxvIMEBAFlEkizpLB36nYMQFYYWWeZCEFqW3cZCDccm0aXhVm74Vugq5gxld6g4U9Cozl0WCl2twlxbg3ZATuryf9RY2WUV8Nonp0gGJH9dxSzkMlH11MZAbWZBOzQxlodrXZAB6yIPb6nCKdD2uvo6ZBZAt4zHUUiIb35B2x6ARwLrHIlF',
    verify: 'ILC_VERIFY'
})

var state = {
  'INITIAL': 0,
  'NAME_REQUEST': 1,
  'TIME_REQUEST': 2,
  'NAME_CONFIRM': 3,
  'TIME_CONFIRM': 4,
  'REQUEST_COMPLETE': 5,
  'ERROR': 6,
  'HELP': 7,
  'CLOSE': 8,
  'STATE': 9
}

var people = {}
var person = {
  "correspondant_name": "",
  "corresondant_time": "",
  "convo_state": state.INITIAL,
  "conversation": [],
  "last_message": "",
  "is_done": false
}

var response = ""

bot.on('error', (err) => {
    console.log(err.message)
})


bot.on('message', (payload, reply) => {
    // let text = 'You said: ' + payload.message.text
    console.log('Timestamp: ' + payload.timestamp)

    let text = payload.message.text

    var response = ""

    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        var name = profile.first_name + ' ' + profile.last_name
        initialize_person(name, payload, response)
        response = delegate_response(name, payload)

        reply({ "text": response }, (err) => {
            if (err) throw err
            console.log(`Echoed back to ${profile.first_name} ${profile.last_name} (${payload.sender.id}): ${text}`)
        })
    })
})

function delegate_response(name, payload) {
  switch(people[name]['convo_state']) {
    case state.INITIAL:
      response = initialize_new_convo(name, payload, response)
      break;
    case state.NAME_CONFIRM:
      response = name_confirm(name, payload)
      break;
    case state.TIME_REQUEST:
      response = time_request(name, payload)
      break;
    case state.TIME_CONFIRM:
      response = time_confirm(name, payload)
    default:
      break;
  }
  return response
}

function initialize_person(name, payload, callback) {
  if(!(name in people)) {
    console.log("Initializing a new person")
    people[name] = {
      "correspondant_name": "",
      "corresondant_time": "",
      "convo_state": state.INITIAL,
      "conversation": [],
      "last_message": "",
      "is_done": false
    }
  }
}

function initialize_new_convo(name, payload, callback) {
  console.log("Initializing a new convo")
  response = "Hello! Welcome to Automated Responder."
  response += "\n\nTo get started, enter the name of the person you want to contact in the following format: Firstname Lastname"

  people[name]['convo_state'] = state.NAME_CONFIRM
  return response
};

function name_confirm(name, payload) {
  console.log("Confirming name")
  people[name]['correspondant_name'] = parse.getName(payload.message.text)
  response = "You'd like to see " + people[name]['correspondant_name'] + "'s schedule. Is that correct?"

  // if affirmative, request time
  people[name]['convo_state'] = state.TIME_REQUEST
  return response
}

function time_request(name, payload) {
  response = "Great! Next, please enter the time availability you'd like to see!"
  people[name]["convo_state"] = state.TIME_CONFIRM
  return response
}


function time_confirm(name, payload) {
  people[name]['correspondant_time'] = JSON.stringify(parse.getTime(payload.message.text))
  response = "To confirm, you'd like to see " + people[name]["correspondant_name"] + "'s availability at the following time: " + people[name]['correspondant_time']
  response += "\nIs this correct?"
  return response
}


http.createServer(bot.middleware()).listen(3000)
