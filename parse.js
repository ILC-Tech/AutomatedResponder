// module for our own parsing, for example, if we want to extract named entities on our own
// should also explore adding to the Messenger NLP services using Wit.ai
// https://developers.facebook.com/docs/messenger-platform/built-in-nlp#overview

'use strict'

// install chrono from https://github.com/wanasit/chrono
const chrono = require('chrono-node') // for date-time parsing

// Returns the first matching entity found in the Messenger NLP object
let getFirstEntity = function(msg, name) {
    return msg.nlp && msg.nlp.entities && msg.nlp.entities && msg.nlp.entities[name] && msg.nlp.entities[name][0];
}

let extractNames = function(str) {
    // converts str to Title Case
    let titleCase = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    return titleCase.match(/[A-Za-z ]+/g)
}

let extractTimes = function(str) {
    let date_time = chrono.parse(str)
    let num_results = date_time.length
    let results = new Array(num_results)
    for (let i = 0; i < num_results; i++) {
        results[i] = {}
        if (date_time[i].start) {
            console.log(date_time[i].start)
            results[i].start = date_time[i].start
        }
        if (date_time[i].end) {
            console.log(date_time[i].end)
            results[i].end = date_time[i].end
        }
    }
    return results
}

// Returns an formatted query object which can be processed
// Currenly only accepts a strict naive format
let parseQuery = function(query) {
    let entities = {} // should have things like names, date extracted, type of query, etc.
    let names = extractNames(query)
    console.log(names)
    let times = extractTimes(query)
    console.log(times)
    entities.names = names
    entities.times = times
    let queryLower = query.toLowerCase()
    if queryLower.startsWith('update') {
        entities.queryType = 'update'
    }
    else if queryLower.startsWith('calendar') || queryLower.startsWith('where is') || queryLower.startsWith("where's") {
        entities.queryType = 'calendar'
    }
    else if queryLower.startsWith('help') {
        entities.queryType = 'help'
    }
    else {
        entities.queryType = 'unknown'
    }
    return entities
}

let help = function() {
    return "With this bot, you can find out what your friends' calendars look like at any given time, as well as share your own calendar with them! Here's how to use this bot:\n\nSay 'calendar' followed by your friend's name to get your friend's current schedule.\n\nSay 'update' followed by a time and an event name to add an event to your own calendar.\n\nHappy scheduling!"
}

let getFriendCalendar = function(user_profile, entities) {
    return friend_id
}

let updateCalendar = function(user_profile, entities) {
    // update the user's calendar
    let response = 'update query.\n'
    if entities.times:
        response += 'Time: ' + entities.times[0] + '\n'
    if entities.names:
        response += 'Names found: ' + entities.names
    return response
}

module.exports = {
    process: function(payload, profile) {
        let entities = parseQuery(payload.message.text)
        let response = ''
        switch(entities.queryType) {
            case 'update':
                response += updateCalendar(profile, entities)
                break
            case 'calendar':
                response += getFriendCalendar(profile, entities)
                break
            case 'unknown':
                response += 'Sorry! I did not understand your query.\n'
            case 'help':
                response += help()
                break
        }
        return entities + '\n' + response
    },
    debug_process: function(payload, profile) {
        // do something with entities
        // call calendar API however needed
        // generate response text
        let entities = parseQuery(payload.message.text)
        let response = ''
        response += 'Potential names found: ' + entities.names + '\n'
        response += 'Potential start times found: \n'
        for (let i = 0; i < entities.times.length; i++) {
            // console.log(entities.times[i].start)
            response += entities.times[i].start.date() + '\n'
        }
        return response
    },
    greeting: function(payload, profile) {
        let greeting = getFirstEntity(payload.message, 'greetings')
        console.log('NLP shows greetings: ' + Boolean(greeting))
        let text = ''
        if (greeting && greeting.confidence > 0.8) {
            text += `Hello to you too, ${profile.first_name}!`
        }
        else {
            text += `Hi there, ${profile.first_name}! How can I help you today?`
        }
        return text
    },
    // some simple placeholder functions for now
    selectName: function(names, listOfFriends) {
        let i = listOfFriends.indexOf(names);
        if (i >= 0) {
            return listOfFriends[i];
        }
        else {
            return null
        }
    }
};
