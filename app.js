'use strict'
const http = require('http')
const Bot = require('messenger-bot')
const parse = require('./parse')

let bot = new Bot({
    token: 'EAAPZCNFxvIMEBAE9Tab6FZCpgZBJw9tPOgOemMqnqOLSabuzPfapONeY7IvYVsebQXqQ6V0kBU3XwnGM8MAe6txbR0YGM2fKHdyZAIYAAdKRO8PalWD2JrxHDWxmffUZCcjauay2n8GZA6hDU5GMtC3BIzLquqh4cqEgERQO1nv1YZAspqfDMK9',
    verify: 'ILC_VERIFY'
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    // let text = 'You said: ' + payload.message.text
    let greeting = parse.getFirstEntity(payload.message.nlp, 'greetings');
    // console.log(payload.message.nlp.entities)
    console.log('NLP shows greetings: ' + Boolean(greeting))
    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err
        let text = ''
        if (greeting && greeting.confidence > 0.8) {
            text += `Hello to you too, ${profile.first_name}!`
        }
        else {
            text += `Hi there, ${profile.first_name}! How can I help you today?`
        }
        reply({ text }, (err) => {
            if (err) throw err
            console.log(`Echoed back to ${profile.first_name} ${profile.last_name} (${payload.sender.id}): ${text}`)
        })
    })
})

http.createServer(bot.middleware()).listen(3000)
