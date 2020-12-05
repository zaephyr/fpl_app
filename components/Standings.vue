<template>
  <div class="flex flex-col">
    <div class="flex-grow overflow-auto">
      <table class="border-collapse mx-auto">
        <thead>
          <tr>
            <th class="table-head">Player</th>
            <th class="table-head">GW Points</th>

            <th class="table-head">Total</th>
            <th class="table-head">Live Total</th>
            <th class="table-head">Captain</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-primary bg-green-100">
          <tr v-for="player in getStandings" :key="player.id">
            <td class="table-cell">{{ player.entry_name }}</td>
            <td class="table-cell">
              {{ player.event_total }}
            </td>
            <td class="table-cell">
              {{ player.total }}
            </td>
            <td class="table-cell">live</td>
            <td class="table-cell">
              {{ player.captain }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['getSquads', 'getStandings', 'getActiveLeague']),
  },
}
</script>

<style></style>
