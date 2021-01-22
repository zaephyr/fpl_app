<template>
  <div id="rh-multiline" class="svg-content"></div>
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
      rankData: null,
      maxPoints: null,
      numGW: null,
    }
  },
  mounted() {
    this.numGW = this.dataToChart[0].gwTotal.length

    this.maxPoints =
      Math.ceil(
        this.dataToChart[0].gwTotal[this.dataToChart[0].gwTotal.length - 1]
          .total / 10
      ) * 10

    let cleanedData = this.dataToChart.map((el) => {
      let obj = { name: el.name, values: el.gwTotal }
      if (el.gwTotal.length < this.numGW) {
        let lateStart = this.numGW - el.gwTotal.length
        let startingGW = el.gwTotal[0].gameWeek

        while (startingGW != 1) {
          console.log(startingGW)
          obj.values.unshift({ gameWeek: startingGW - 1, total: 0 })
          startingGW--
        }
      }
      return obj
    })

    console.log(this.numGW, cleanedData)
    this.renderMultiLineChart(cleanedData)
  },
  methods: {
    renderMultiLineChart(rank_val) {
      const width = 800
      const height = 400
      const margin = 5
      const padding = 5
      const adj = 30

      const svg = d3
        .select('#rh-multiline')
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr(
          'viewBox',
          '-' +
            adj +
            ' -' +
            adj +
            ' ' +
            (width + adj * 3) +
            ' ' +
            (height + adj * 3)
        )
        .style('padding', padding)
        .style('margin', margin)
        .classed('svg-content', true)

      //SCALE

      const xScale = d3.scaleLinear().range([0, width])
      const yScale = d3.scaleLinear().rangeRound([height, 0])

      xScale.domain([0, this.numGW])

      yScale.domain([0, this.maxPoints])

      //AXIS

      const yAxis = d3.axisRight().scale(yScale)
      const xAxis = d3.axisBottom().scale(xScale)

      svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxis)

      svg.append('g').attr('class', 'axis').call(yAxis)
      // .attr('transform', `translate(${width}, 0)`) y Axis na desni

      //LINES

      const line = d3
        .line()
        .x((d) => {
          return xScale(d.gameWeek)
        })
        .y((d) => {
          return yScale(d.total)
        })
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

      const lines = svg.selectAll('lines').data(rank_val).enter().append('g')
      lines
        .append('path')
        .attr('class', 'line')
        .attr('d', (d) => {
          return line(d.values)
        })
        .style('stroke', colorPick)
        .style('fill', 'none')

      // MANAGER NAMES
      // lines
      //   .append('text')
      //   .attr('class', 'manager')
      //   .datum(function (d) {
      //     return {
      //       id: d.name,
      //       value: d.values[d.values.length - 1],
      //     }
      //   })
      //   .attr('transform', function (d) {
      //     return (
      //       'translate(' +
      //       (xScale(d.value.gameWeek) + 10) +
      //       ',' +
      //       (yScale(d.value.total) + 5) +
      //       ')'
      //     )
      //   })
      //   .attr('x', 5)
      //   .text(function (d) {
      //     return d.id
      //   })

      const totalLength = lines.select('.line').node().getTotalLength()
      lines
        .select('.line')
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(5000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)
    },
  },
}
</script>

<style>
.axis line {
  stroke: #706f6f;
  stroke-width: 0.5;
  shape-rendering: crispEdges;
}

/* axis contour */
.axis path {
  stroke: #706f6f;
  stroke-width: 0.7;
  shape-rendering: crispEdges;
}

/* axis text */
.axis text {
  fill: #2b2929;
  font-family: Georgia;
  font-size: 120%;
}

.manager {
  fill: #2b2929;
  font-family: Georgia;
  font-size: 80%;
}
</style>
