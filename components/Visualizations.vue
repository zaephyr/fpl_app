-
<template>
  <div
    class="w-full"
    :class="{
      'flex justify-center': $fetchState.pending || $fetchState.error,
    }"
  >
    <D3MultiLineChart
      v-if="chart == 'line-climb'"
      :dataToChart="slicedRankHistory"
    />
    <D3SlopeChart
      v-else-if="chart == 'slope-chart'"
      :dataToChart="slicedRankHistory"
    />
    <LoadingSpinner v-if="$fetchState.pending" class="mt-16" />
    <p v-else-if="$fetchState.error">An error occurred :(</p>

    <div v-else class="w-1/5 ml-auto mt-4 mr-4 flex flex-col">
      <select class="dropdown" name="position" v-model="viewChart">
        <option value="slope-chart" selected>GameWeek to GameWeek</option>
        <option value="line-chart" selected>Season Points</option>
      </select>

      <div class="px-8">
        <input
          type="range"
          min="2"
          :max="max"
          step="1"
          v-model="numManagers"
          class="w-full"
        />
        <div class="flex justify-between">
          <span>Show </span>
          <input type="number" v-model="numManagers" class="w-1/5" />
          <span>managers.</span>
        </div>
      </div>

      <div v-if="getFplID" class="mx-auto flex flex-col">
        <div>
          <input type="radio" id="top" value="Top" v-model="picked" />
          <label for="top">Top of the League</label>
        </div>
        <div>
          <input type="radio" id="around" value="Around" v-model="picked" />
          <label for="around">Around You</label>
        </div>
      </div>

      <button @click="renderChart" class="btn">Rander Chart</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rankHistory: null,
      slicedRankHistory: null,
      chart: '',
      viewChart: 'slope-chart',
      numManagers: 5,
      max: null,
      picked: 'Top',
    }
  },
  fetchDelay: 2000,
  async fetch() {
    const standings = this.getStandings[this.getActiveLeague]

    Promise.all(
      standings.map(async (player) => {
        const historyData = await this.$axios
          .$get(`api/entry/${player.entry}/history/`)
          .then((res) => {
            const gwArr = res.current
            const gwTotal = []
            gwArr.forEach((gw) => {
              gwTotal.push({ gameWeek: gw.event, total: gw.total_points })
            })
            const manager = {
              chips: res.chips,
              name: player.entry_name,
              gwTotal: gwTotal,
              id: player.entry,
            }
            return manager
          })

        return historyData
      })
    ).then((val) => {
      this.rankHistory = val
      this.max = val.length < 15 ? val.length : 15
    })
  },
  computed: {
    ...mapGetters(['getStandings', 'getActiveLeague', 'getFplID']),
  },
  methods: {
    renderChart() {
      console.log(this.rankHistory)
      if (this.picked === 'Top') {
        this.slicedRankHistory = this.rankHistory.slice(0, this.numManagers)
      } else {
        let index = this.rankHistory.findIndex((el) => el.id == this.getFplID)

        let rHlen = this.rankHistory.length - 1
        let rangeStart = index - Math.ceil(this.numManagers / 2)
        let rangeEnd =
          rangeStart > 0
            ? index + Math.floor(this.numManagers / 2)
            : this.numManagers
        console.log(index, rangeStart, rangeEnd)
        this.slicedRankHistory = this.rankHistory.slice(
          rangeStart > 0 ? rangeStart : 0,
          rangeEnd < rHlen ? rangeEnd : rHlen
        )
      }
      this.chart = this.viewChart
      console.log(this.chart, this.slicedRankHistory)
    },
  },
}
</script>

<style lang="scss" scoped></style>
