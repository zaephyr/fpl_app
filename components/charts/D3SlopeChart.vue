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
      gw: 1,
      colorID: 0,
      color: [
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
      ],
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

    this.renderSlopeChart(cleanedData)
  },
  methods: {
    labels(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
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
    },
    colorPick() {
      return this.color[this.colorID++]
    },
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

      function halo(text) {
        text.clone(true).each(function () {
          this.parentNode.insertBefore(this, this.previousSibling)
        })
      }

      let xScale = d3.scalePoint().range([margin.left, width - margin.right])
      let yScale = d3
        .scaleLinear()
        .rangeRound([height - margin.bottom, margin.top])

      xScale.domain([0, 1])
      yScale.domain([
        d3.min(data[0], (d) => d.values[0]),
        d3.max(data[0], (d) => d.values[1]),
      ])

      svg
        .append('g')
        .attr('text-anchor', 'middle')
        .selectAll('g')
        .data([0, 'gw1'])
        .join('g')
        .attr('transform', (d, i) => `translate(${xScale(i)},20)`)
        .attr('class', 'gws')
        .call((g) => g.append('text').text((d) => d))
        .call((g) =>
          g.append('line').attr('y1', 3).attr('y2', 9).attr('stroke', 'black')
        )

      const line = d3
        .line()
        .x((d, i) => {
          return xScale(i)
        })
        .y((d) => {
          return yScale(d)
        })
      console.log(data)

      const lines = svg
        .selectAll('.line')
        .data(data[0])
        .enter()
        .append('g')
        .attr('class', 'line')

      lines
        .append('path')
        .attr('d', (d, i) => {
          return line(d.values)
        })
        .attr('fill', 'none')
        .attr('stroke', this.colorPick)

      let managerName = svg.append('g').selectAll('g').data([0, 1]).join('g')

      managerName
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
            data[0].map(
              i === 0
                ? (d) => `${d.name} ${d.values[i]}`
                : (d) => `${d.values[i]} ${d.name}`
            ),
            this.labels(data[0].map((d) => yScale(d.values[i])))
          )
        })
        .join('text')
        .attr('y', ([, y]) => y)
        .attr('dy', '0.35em')
        .text(([text]) => text)
        .call(halo)

      const refreshChart = () => {
        let gwArr = data[this.gw]
        yScale.domain([
          d3.min(gwArr, (d) => d.values[0]),
          d3.max(gwArr, (d) => d.values[1]),
        ])

        let fromTo = ['gw' + this.gw, 'gw' + (this.gw + 1)]

        let newLines = svg
          .selectAll('.line')
          .data(gwArr)
          .transition()
          .duration(1000)

        newLines.select('path').attr('d', (d, i) => {
          return line(d.values)
        })

        svg
          .selectAll('g.gws')
          .data(fromTo)
          .select('text')
          .text((d) => d)

        managerName
          .selectAll('text')
          .data((d, i) => {
            return d3.zip(
              gwArr.map(
                i === 0
                  ? (d) => `${d.name} ${d.values[i]}`
                  : (d) => `${d.values[i]} ${d.name}`
              ),
              this.labels(gwArr.map((d) => yScale(d.values[i])))
            )
          })
          .join('text')
          .transition()
          .duration(1000)
          .attr('y', ([, y]) => y)
          .attr('dy', '0.35em')
          .text(([text]) => text)

        this.gw++
        if (this.gw > data.length - 1) {
          clearInterval(this.interval)
        }
      }

      this.interval = setInterval(function () {
        refreshChart()
      }, 1400)

      //   const lines = svg.selectAll('.lines').data('data[currGW]')

      //   lines.enter().append('line').attr('class', 'line')
    },
  },
}
</script>

<style></style>
