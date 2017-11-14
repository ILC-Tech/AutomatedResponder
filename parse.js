// module for our own parsing, for example, if we want to extract named entities on our own
// should also explore adding to the Messenger NLP services using Wit.ai
// https://developers.facebook.com/docs/messenger-platform/built-in-nlp#overview

'use strict'

// Returns the first matching entity found in the Messenger NLP object
let getFirstEntity = function(m, name) {
    return m.nlp && m.nlp.entities && m.nlp.entities && m.nlp.entities[name] && m.nlp.entities[name][0];
}

module.exports = {
    process: function(payload, profile) {
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
    extractNames: function(str) {
        // converts str to Title Case
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    },
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
