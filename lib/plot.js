'use strict'

const d3 = require('d3')
const h = require('react').createElement
const { renderToStaticMarkup } = require('react-dom/server')

module.exports = function plot ({ data, title }) {
  const width = 100
  const height = 40
  const padding = { top: 10, right: 20, bottom: 10, left: 5 }

  const chartHeight = height - padding.left - padding.right
  const chartWidth = width - padding.top - padding.bottom

  const x = d3.scaleLinear()
    .domain([ 0, data.length - 1 ])
    .range([ 0, chartWidth ])

  const y = d3.scaleLinear()
    .domain([ 0, Math.max(10, d3.max(data)) ])
    .range([ chartHeight, 0 ])

  function Tick (props) {
    return h('g', { transform: `translate(${x(props.x)},${chartHeight})` },
      h('line', {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 2,
        strokeWidth: 0.5,
        stroke: '#fff',
        fill: 'none'
      }),
      props.label != null && h('text', {
        textAnchor: 'middle',
        x: 0,
        y: padding.bottom,
        fill: '#fff',
        opacity: 0.9,
        style: {
          fontFamily: '-apple-system,sans-serif',
          fontSize: 8
        }
      }, props.label)
    )
  }

  function HTick (props) {
    return h('g', { transform: `translate(${chartWidth},${y(props.y)})` },
      h('line', {
        x1: -chartWidth,
        x2: 2,
        y1: 0,
        y2: 0,
        strokeWidth: 0.5,
        opacity: 0.3,
        stroke: '#fff',
        fill: 'none'
      }),
      props.label != null && h('text', {
        textAnchor: 'left',
        x: 3,
        y: 3,
        fill: '#fff',
        opacity: 0.9,
        style: {
          fontFamily: '-apple-system,sans-serif',
          fontSize: 8
        }
      }, props.label)
    )
  }

  const area = d3.area().x((_, i) => x(i)).y1(y).y0(y(0)).curve(d3.curveMonotoneX)

  const stage = h('g', { transform: `translate(${padding.left},${padding.top})` },
    h('rect', { x: 0, y: 0, width: chartWidth, height: chartHeight, fill: '#000', opacity: 0.2 }),
    h(HTick, { y: d3.max(data), label: d3.max(data) }),
    h('path', { d: area(data), fill: '#fff', opacity: 0.9 }),
    data.map((_, i) => (i % 2) ? null : h(Tick, { key: i, x: i, label: i % 4 ? null : i * 15 }))
  )

  const titleEl = h('text', {
    x: padding.left,
    y: padding.top - 4,
    fill: '#fff',
    opacity: 0.7,
    style: {
      fontFamily: '-apple-system,sans-serif',
      fontWeight: 'bold',
      fontSize: 8
    }
  }, title)

  const doctype = `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`
  const xmlns = 'http://www.w3.org/2000/svg'
  return doctype + renderToStaticMarkup(h('svg', { width, height, xmlns }, stage, titleEl))
}
