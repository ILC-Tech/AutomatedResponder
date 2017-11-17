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
    return entities
}

module.exports = {
    process: function(payload, profile) {
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
