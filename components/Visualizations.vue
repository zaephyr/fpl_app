-
<template>
  <div
    class="w-full"
    :class="{
      'flex justify-center': $fetchState.pending || $fetchState.error,
    }"
  >
    <LoadingSpinner v-if="$fetchState.pending" class="mt-16" />
    <p v-else-if="$fetchState.error">An error occurred :(</p>

    <div v-else>
      <button @click="toggleChart('line-climb')" class="btn">
        Line climb chart
      </button>
      <button @click="toggleChart('slope-chart')" class="btn">
        Slope chart
      </button>
    </div>

    <D3MultiLineChart v-if="chart == 'line-climb'" :dataToChart="rankHistory" />
    <D3SlopeChart
      v-else-if="chart == 'slope-chart'"
      :dataToChart="rankHistory"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      rankHistory: null,
      chart: '',
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
            }
            return manager
          })

        return historyData
      })
    ).then((val) => {
      this.rankHistory = val

      console.log(this.rankHistory)
    })
  },
  computed: {
    ...mapGetters(['getStandings', 'getActiveLeague']),
  },
  methods: {
    toggleChart(val) {
      this.chart = ''
      this.chart = val
    },
  },
}
</script>

<style lang="scss" scoped></style>
