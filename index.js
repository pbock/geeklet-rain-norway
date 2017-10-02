'use strict'

const nowcast = require('./lib/nowcast')

// const location = require('@derhuerst/location')
// location((err, loc) => {
//   if (err) return console.error(err)
//   nowcast(loc).then(l => console.log(plot(l)))
// })

Promise.all([
  nowcast([ 5.353524, 60.316782 ]),
  nowcast([ 5.326066, 60.391028 ]),
  nowcast([ 10.756228, 59.911398 ])
])
.then(places => {
  console.log(places.map(plot).join('\n'))
})

function plot ({ forecasts }) {
  return forecasts
    .map(r => r.precipitation)
    .join(', ')
}
