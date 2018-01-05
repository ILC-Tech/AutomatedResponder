'use strict'
const http = require('http')
const Bot = require('messenger-bot')
const parse = require('./parse')

let bot = new Bot({
    token: 'EAAPZCNFxvIMEBAFlEkizpLB36nYMQFYYWWeZCEFqW3cZCDccm0aXhVm74Vugq5gxld6g4U9Cozl0WCl2twlxbg3ZATuryf9RY2WUV8Nonp0gGJH9dxSzkMlH11MZAbWZBOzQxlodrXZAB6yIPb6nCKdD2uvo6ZBZAt4zHUUiIb35B2x6ARwLrHIlF',
    verify: 'ILC_VERIFY'
})

bot.on('error', (err) => {
    console.log(err.message)
})

bot.on('message', (payload, reply) => {
    // let text = 'You said: ' + payload.message.text
    console.log('Timestamp: ' + payload.timestamp)
    bot.getProfile(payload.sender.id, (err, profile) => {
        if (err) throw err

        let text = parse.process(payload, profile);
        reply({ text }, (err) => {
            if (err) throw err
            console.log(`Echoed back to ${profile.first_name} ${profile.last_name} (${payload.sender.id}): ${text}`)
        })
    })
})

http.createServer(bot.middleware()).listen(3000)
