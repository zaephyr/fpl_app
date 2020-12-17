<template>
  <div class="flex flex-col h-100 overflow-y-auto w-1/3 mx-auto">
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
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getSquads', 'getActiveLeague']),
    ownership() {
      let players = []
      const squads = this.getSquads[this.getActiveLeague]

      for (let squad in squads) {
        squads[squad].forEach((player) => {
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
      const numSquads = Object.keys(squads).length
      console.log(numSquads)
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
