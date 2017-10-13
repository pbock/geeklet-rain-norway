'use strict'

const convert = require('xml-js')
const fetch = require('isomorphic-fetch')
const inquirer = require('inquirer')
const { stringify } = require('querystring')
const tmp = require('tmp')
const fs = require('fs')
const path = require('path')
const opn = require('opn')

console.log(`Let's get your Rain Forecast Geeklet set up.`)
console.log()
console.log(`For which place in Norway do you want to display a rain forecast?`)

let title

inquirer.prompt({
  name: 'placeName',
  message: 'Place Name'
})
.then(({ placeName }) => {
  if (!placeName) return askForCoordinates()

  title = placeName
  // Try to resolve place names with GeoNorge
  return fetch('https://ws.geonorge.no/SKWS3Index/ssr/sok?' + stringify({
    navn: placeName,
    epsgKode: '4326'
  }))
  .then(r => r.text())
  .then(input => convert.xml2js(input, { compact: true }))
  .then(results => results.sokRes.stedsnavn)
  .then(suggestions => {
    // Display a list of suggestions
    console.log(`Did you mean one of these?`)
    return inquirer.prompt({
      type: 'list',
      message: 'Place suggestions',
      name: 'coordinates',
      pageSize: 20,
      default: 1,
      choices: [
        { name: 'None of these', value: null },
        new inquirer.Separator(),
        ...suggestions.map(s => ({
          name: `${s.stedsnavn._text}, ${s.kommunenavn._text}, ${s.fylkesnavn._text}`,
          value: { latitude: +s.nord._text, longitude: +s.aust._text }
        }))
      ]
    })
  })
  // If the above chain fails for whatever reason or if the "N/A" option was
  // selected, just ask for coordinates
  .then(r => r.coordinates ? r : askForCoordinates())
  .catch(askForCoordinates)
})
.then(({ coordinates }) => {
  // Create a temporary .glet file and try to open it
  const config = generateConfigFile(Object.assign({ title }, coordinates))
  const filename = tmp.tmpNameSync({ postfix: '.glet' })
  fs.writeFileSync(filename, config)
  console.log(`Wrote a temporary geeklet config file to ${filename}.`)
  console.log(`Trying to open it. Make sure you have GeekTool installed.`)
  return opn(filename, { wait: false })
})

function askForCoordinates () {
  console.log(`Sorry, I couldn't resolve that place name to coordinates,`)
  console.log(`so you'll need to provide them manually.`)
  return inquirer.prompt([
    {
      name: 'latitude',
      message: 'Latitude (degrees, decimal)',
      filter: parseFloat
    },
    {
      name: 'longitude',
      message: 'Latitude (degrees, decimal)',
      filter: parseFloat
    }
  ]).then(coordinates => ({ coordinates }))
}

function generateConfigFile(options = {}) {
  const template = fs.readFileSync(path.resolve(__dirname, 'template.glet')).toString()
  const title = options.title ? `Rain Forecast (${options.title})` : 'Rain Forecast'

  return template.replace(/{{NAME}}/, title)
    .replace(/{{NODE}}/, process.argv[0])
    .replace(/{{SCRIPT}}/, path.resolve(__dirname, 'index.js'))
    .replace(/{{ARGS}}/, [ options.latitude, options.longitude, options.title ].join(' ').trim())
}
