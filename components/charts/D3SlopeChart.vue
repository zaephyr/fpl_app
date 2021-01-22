<template>
  <div id="rh-slope" class="svg-content w-1/2 mx-auto"></div>
</template>

<script>
import * as d3 from 'd3'
export default {
  props: {
    dataToChart: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      interval: '',
      gw: 0,
    }
  },
  mounted() {
    if (this.chart != null) this.chart.remove()
    this.numGW = this.dataToChart[0].gwTotal.length

    let cleanedData = Array.from(Array(this.numGW), (x, index) => [])

    this.dataToChart.forEach((el) => {
      for (let i = 0; i < el.gwTotal.length; i++) {
        if (i == 0 && i == el.gwTotal[i].gameWeek - 1) {
          const newObj = {
            name: el.name,
            gameWeek: el.gwTotal[i].gameWeek,
            values: [0, el.gwTotal[i].total],
          }
          cleanedData[i].push(newObj)
        } else if (i == el.gwTotal[i].gameWeek - 1 && i != 0) {
          const newObj = {
            name: el.name,
            gameWeek: el.gwTotal[i].gameWeek,
            values: [el.gwTotal[i - 1].total, el.gwTotal[i].total],
          }
          cleanedData[i].push(newObj)
        }
      }
    })

    console.log(cleanedData)
    this.renderSlopeChart(cleanedData)
  },
  methods: {
    renderSlopeChart(data) {
      const width = 600
      const height = 400
      const margin = { top: 40, right: 120, bottom: 10, left: 120 }
      const padding = 5
      const adj = 30

      const svg = d3
        .select('#rh-slope')
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .classed('svg-content', true)

      const xScale = d3.scalePoint().range([margin.left, width - margin.right])
      const yScale = d3
        .scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

      xScale.domain([this.gw, this.gw + 1])

      yScale.domain([
        d3.min(data[18], (d) => d.values[0]),
        d3.max(data[18], (d) => d.values[1]),
      ])

      let color = [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#b82e2e',
        '#316395',
        '#3366cc',
        '#994499',
        '#22aa99',
        '#aaaa11',
        '#6633cc',
        '#e67300',
        '#8b0707',
        '#651067',
        '#329262',
        '#5574a6',
        '#3b3eac',
        '#b77322',
        '#16d620',
        '#b91383',
        '#f4359e',
        '#9c5935',
        '#a9c413',
        '#2a778d',
        '#668d1c',
        '#bea413',
        '#0c5922',
        '#743411',
      ]

      let id = 0

      const colorPick = () => {
        return color[id++]
      }

      const line = d3
        .line()
        .x((d, i) => {
          return xScale(i)
        })
        .y((d) => {
          return yScale(d)
        })

      svg
        .append('g')
        .selectAll('path')
        .data(data[18])
        .join('path')
        .attr('d', (d) => {
          return line(d.values)
        })
        .attr('fill', 'none')
        .attr('stroke', colorPick)

      svg
        .append('g')
        .attr('text-anchor', 'middle')
        .selectAll('g')
        .data(['gw' + this.gw, 'gw' + (this.gw + 1)])
        .join('g')
        .attr('transform', (d, i) => `translate(${xScale(i)},20)`)
        .call((g) => g.append('text').text((d) => d))
        .call((g) =>
          g.append('line').attr('y1', 3).attr('y2', 9).attr('stroke', 'black')
        )

      svg
        .append('g')
        .selectAll('g')
        .data(['gw' + this.gw, 'gw' + (this.gw + 1)])
        .join('g')
        .attr(
          'transform',
          (d, i) =>
            `translate(${
              xScale(i) + (i === 0 ? -padding : i === 1 ? padding : 0)
            },0)`
        )
        .attr('text-anchor', (d, i) =>
          i === 0 ? 'end' : i === 1 ? 'start' : 'middle'
        )
        .selectAll('text')
        .data((d, i) => {
          return d3.zip(
            data[18].map(
              i === 0
                ? (d) => `${d.name} ${d.values[i]}`
                : (d) => `${d.values[i]} ${d.name}`
            ),
            labels(data[18].map((d) => yScale(d.values[i])))
          )
        })
        .join('text')
        .attr('y', ([, y]) => y)
        .attr('dy', '0.35em')
        .text(([text]) => text)
        .call(halo)

      function labels(
        positions,
        separation = 10,
        maxiter = 10,
        maxerror = 1e-1
      ) {
        let labelPositions = Array.from(positions)
        let n = labelPositions.length
        if (!(n > 1)) return labelPositions

        let index = d3.range(labelPositions.length)
        for (let iter = 0; iter < maxiter; iter++) {
          index.sort((a, b) => {
            return d3.ascending(labelPositions[a], labelPositions[b])
          })
          let error = 0
          for (let i = 1; i < n; i++) {
            let delta = labelPositions[index[i]] - labelPositions[index[i - 1]]
            if (delta < separation) {
              delta = (separation - delta) / 2
              error = Math.max(error, delta)
              labelPositions[index[i - 1]] -= delta
              labelPositions[index[i]] += delta
            }
          }
          if (error < maxerror) break
        }
        return labelPositions
      }

      function halo(text) {
        text
          .clone(true)
          .each(function () {
            this.parentNode.insertBefore(this, this.previousSibling)
          })
          .attr('class', 'label')
          .attr('fill', 'none')
          .attr('stroke', 'white')
          .attr('stroke-width', 4)
          .attr('stroke-linejoin', 'round')
      }

      //SCALE

      //   const refreshChart = () => {
      //     let values = data[this.gw]
      //     console.log(this.gw)
      //     let dataColumns = ['gw' + this.gw - 1, 'gw' + this.gw]

      //     svg
      //       .append('g')
      //       .attr('text-anchor', 'middle')
      //       .selectAll('g')
      //       .data(dataColumns)
      //       .join('g')
      //       .attr('transform', (d, i) => `translate(${xScale(i)},20)`)
      //       .call((g) => g.append('text').text((d) => d))
      //       .call((g) =>
      //         g.append('line').attr('y1', 3).attr('y2', 9).attr('stroke', 'black')
      //       )

      //     const xScale = d3
      //       .scalePoint()
      //       .range([margin + padding, width - margin - padding])
      //       .domain(d3.range(2))

      //     const yScale = d3
      //       .scaleLinear()
      //       .range([height, 0])
      //       .domain([
      //         d3.min(values, (d) => d.prevTotal),
      //         d3.max(values, (d) => d.newTotal),
      //       ])

      //     const yAxisLeft = d3.axisLeft().scale(yScale)
      //     const yAxisRight = d3.axisRight().scale(yScale)

      //     svg.append('g').attr('class', 'axis').call(yAxisLeft)
      //     svg.append('g').attr('class', 'axis').call(yAxisRight)
      //     this.gw++
      //     if (this.gw > data.length - 1) {
      //       clearInterval(this.interval)
      //     }
      //   }

      //   this.interval = setInterval(function () {
      //     refreshChart()
      //   }, 1000)

      //   const lines = svg.selectAll('.lines').data('data[currGW]')

      //   lines.enter().append('line').attr('class', 'line')
    },
  },
}
</script>

<style></style>
