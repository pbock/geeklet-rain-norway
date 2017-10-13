'use strict'

const nowcast = require('./lib/nowcast')
const plot = require('./lib/plot')

const args = process.argv.slice(2)

if (args.length < 2) {
  console.error(`Usage: ${process.argv.slice(0, 2).join(' ')} <latitude> <longitude> [label]`)
  process.exit(1)
}

const latitude = +args[0]
const longitude = +args[1]
const title = args[2] || `${latitude}, ${longitude}`

nowcast({ latitude, longitude })
.then(data => {
  if (process.env.DEBUG) console.error(data)
  console.log(plot({ data: data.forecasts.map(f => f.precipitation), title, startTime: data.forecasts[0].time }))
})
