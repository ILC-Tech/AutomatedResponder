'use strict'
const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  token: 'EAAPZCNFxvIMEBAE9Tab6FZCpgZBJw9tPOgOemMqnqOLSabuzPfapONeY7IvYVsebQXqQ6V0kBU3XwnGM8MAe6txbR0YGM2fKHdyZAIYAAdKRO8PalWD2JrxHDWxmffUZCcjauay2n8GZA6hDU5GMtC3BIzLquqh4cqEgERQO1nv1YZAspqfDMK9',
  verify: 'ILC_VERIFY'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = 'You said: ' + payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
