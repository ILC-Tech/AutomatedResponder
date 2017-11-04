// module for our own parsing, for example, if we want to extract named entities on our own
// should also explore adding to the Messenger NLP services using Wit.ai
// https://developers.facebook.com/docs/messenger-platform/built-in-nlp#overview

'use strict'

module.exports = {
    // Returns the first matching entity found in the Messenger NLP object
    getFirstEntity: function(nlp, name) {
        return nlp && nlp.entities && nlp.entities && nlp.entities[name] && nlp.entities[name][0];
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
