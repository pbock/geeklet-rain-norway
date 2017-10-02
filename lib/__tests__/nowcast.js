/* eslint-env jest */

const nowcast = require('../nowcast')
const { readFileSync } = require('fs')
const { resolve } = require('path')

const readData = filename => readFileSync(resolve(__dirname, 'data', filename)).toString()

describe('nowcast.parse', () => {
  it('parses weather data', () => {
    const output = nowcast.parse(readData('nowcast.xml'))
    expect(output).toEqual({
      forecasts: [
        { time: new Date('2017-10-02T12:15:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 2.5 },
        { time: new Date('2017-10-02T12:22:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.1 },
        { time: new Date('2017-10-02T12:30:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.1 },
        { time: new Date('2017-10-02T12:37:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T12:45:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T12:52:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.4 },
        { time: new Date('2017-10-02T13:00:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 2.1 },
        { time: new Date('2017-10-02T13:07:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 1.0 },
        { time: new Date('2017-10-02T13:15:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.6 },
        { time: new Date('2017-10-02T13:22:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T13:30:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T13:37:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T13:45:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T13:52:30Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 },
        { time: new Date('2017-10-02T14:00:00Z'), latitude: 60.1000, longitude: 9.5800, precipitation: 0.0 }
      ]
    })
  })
})
