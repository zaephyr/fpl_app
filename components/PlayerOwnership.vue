<template>
  <div class="flex">
    <div class="flex flex-col h-100 overflow-y-auto min-w-max w-1/3 mx-auto">
      <table class="border-collapse">
        <thead>
          <tr>
            <th class="table-head">Name</th>
            <th class="table-head">Owned</th>
            <th class="table-head">EO %</th>
            <th class="table-head">(c)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary bg-green-100">
          <tr v-for="(player, idx) in ownership" :key="idx">
            <td class="table-cell">{{ player.name }}</td>
            <td class="table-cell">
              {{ player.ownP }}
            </td>
            <td class="table-cell">
              {{ player.eoP }}
            </td>
            <td class="table-cell">
              {{ player.captained }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="w-1/5 mt-4 mr-4 flex flex-col">
      <div class="px-4">
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

      <button @click="rangeOfSquads" class="btn">Rander Chart</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      max: null,
      numManagers: 5,
      picked: 'Top',
      ownership: null,
    }
  },
  mounted() {
    let squads = this.getSquadsByStandings()
    this.max = squads.length < 15 ? squads.length : 15
    this.ownership = this.renderOwnershipTable(squads)
  },
  computed: {
    ...mapGetters(['getSquads', 'getStandings', 'getActiveLeague', 'getFplID']),
  },
  methods: {
    getSquadsByStandings() {
      const squads = this.getStandings[this.getActiveLeague].map(
        (el) => this.getSquads[this.getActiveLeague][el.entry]
      )

      return squads
    },
    rangeOfSquads() {
      let squads = this.getSquadsByStandings()

      if (this.picked === 'Top') {
        squads = squads.slice(0, this.numManagers)
      } else {
        let index = squads.findIndex((el) => el.id == this.getFplID)

        let squadsLen = squads.length - 1
        let rangeStart = index - Math.ceil(this.numManagers / 2)
        let rangeEnd =
          rangeStart > 0
            ? index + Math.floor(this.numManagers / 2)
            : this.numManagers
        squads = squads.slice(
          rangeStart > 0 ? rangeStart : 0,
          rangeEnd < squadsLen ? rangeEnd : squadsLen
        )
      }
      this.ownership = this.renderOwnershipTable(squads)
    },

    renderOwnershipTable(squads) {
      let players = []
      for (let i = 0; i < squads.length; i++) {
        squads[i].forEach((player) => {
          if (!players.some((el) => el.name === player.name)) {
            players.push({ name: player.name, own: 0, eo: 0, is_captain: 0 })
          }

          if (player.is_captain) {
            players[players.findIndex((el) => el.name === player.name)].own =
              (players[players.findIndex((el) => el.name === player.name)]
                .own || 0) + 1

            players[players.findIndex((el) => el.name === player.name)].eo =
              (players[players.findIndex((el) => el.name === player.name)].eo ||
                0) + 2

            players[
              players.findIndex((el) => el.name === player.name)
            ].is_captain =
              (players[players.findIndex((el) => el.name === player.name)]
                .is_captain || 0) + 1
          } else {
            players[players.findIndex((el) => el.name === player.name)].own =
              (players[players.findIndex((el) => el.name === player.name)]
                .own || 0) + 1

            players[players.findIndex((el) => el.name === player.name)].eo =
              (players[players.findIndex((el) => el.name === player.name)].eo ||
                0) + 1
          }
        })
      }
      const numSquads = squads.length
      players.forEach((player) => {
        const ownP = ((player.own / numSquads) * 100).toFixed(2)
        const eoP = ((player.eo / numSquads) * 100).toFixed(2)
        const captP = ((player.is_captain / numSquads) * 100).toFixed(2)
        player.ownP = ownP + '%'
        player.eoP = eoP + '%'
        player.captained = captP + '%'
      })
      players.sort((a, b) => {
        return b.own - a.own
      })
      return players
    },
  },
}
</script>

<style></style>
