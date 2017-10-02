'use strict'

const convert = require('xml-js')
const fetch = require('isomorphic-fetch')

function nowcast (location) {
  const longitude = location.longitude || location[0]
  const latitude = location.latitude || location[1]
  return fetch(`http://api.met.no/weatherapi/nowcast/0.9/?lat=${latitude};lon=${longitude}`)
    .then(r => {
      if (!r.ok) throw new Error(`Fetch request returned status code ${r.status}`)
      return r.text()
    })
    .then(parse)
}

module.exports = nowcast
nowcast.parse = parse

function parse (input) {
  const result = convert.xml2js(input, { compact: true })
  const forecasts = result.weatherdata.product.time.map(el => ({
    time: new Date(el._attributes.from),
    latitude: +el.location._attributes.latitude,
    longitude: +el.location._attributes.longitude,
    precipitation: +el.location.precipitation._attributes.value
  }))
  return { forecasts }
}
