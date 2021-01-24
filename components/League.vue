<template>
  <div class="-mt-11 flex flex-col items-center w-full">
    <ul
      class="flex cursor-pointer text-gray-600 border-solid border-b-2 border-green-200 font-bold onchange"
      :class="{
        'mr-72': getActiveLeague == 'freeHit' && activeTab == 'pickTeam',
      }"
    >
      <li
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'standings' }"
        @click="activeTab = 'standings'"
      >
        Standings
      </li>
      <li
        v-if="getActiveLeague != 'freeHit'"
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'ownership' }"
        @click="activeTab = 'ownership'"
      >
        Ownership
      </li>
      <li
        v-if="getActiveLeague != 'freeHit'"
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'visuals' }"
        @click="activeTab = 'visuals'"
      >
        Visuals
      </li>
      <li
        v-if="getActiveLeague == 'freeHit'"
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'pickTeam' }"
        @click="activeTab = 'pickTeam'"
      >
        Pick A Team
      </li>
    </ul>

    <div
      class="w-full"
      :class="{
        'flex justify-center': $fetchState.pending || $fetchState.error,
      }"
    >
      <LoadingSpinner v-if="$fetchState.pending" class="mt-16" />
      <p v-else-if="$fetchState.error">An error occurred :(</p>
      <transition v-else name="fade" mode="out-in">
        <Standings v-if="activeTab == 'standings'" />
        <PlayerOwnership v-else-if="activeTab == 'ownership'" />
        <PickTeam v-else-if="activeTab == 'pickTeam'" />
        <Visualizations v-else-if="activeTab == 'visuals'" />
      </transition>
    </div>
  </div>
</template>

<script>
import PlayerOwnership from './PlayerOwnership.vue'
import { mapGetters } from 'vuex'
import Visualizations from './Visualizations.vue'
import { clearConfigCache } from 'prettier'
export default {
  components: { PlayerOwnership, Visualizations },
  data() {
    return {
      activeTab: 'standings',
    }
  },
  computed: {
    ...mapGetters([
      'getStandings',
      'getActiveLeague',
      'getSquads',
      'getCurrentGW',
      'getGeneralData',
      'getFreeHitLeague',
      'getUsername',
      'getPlayers',
    ]),
  },
  fetchDelay: 4000,
  async fetch() {
    //so it doesnt do api call if there are standings already

    if (this.getActiveLeague == 'freeHit') {
      const fhteam = await this.$fire.firestore
        .collection('freeHitLeagues')
        .doc(this.getFreeHitLeague)
      fhteam.get().then((doc) => {
        if (doc.exists) {
          const squads = doc.data().squads
          let standings = doc.data().standings
          let gw = doc.data().gw

          standings.sort((a, b) => {
            return b.total - a.total
          })
          this.$store.commit('SET_STANDINGS', standings)
        }
      })
    } else if (!this.getStandings[this.getActiveLeague]) {
      const leagueData = await this.$axios.$get(
        `api/leagues-classic/${this.getActiveLeague}/standings/`
      )

      // doesnt do api call if there are squads already
      if (!this.getSquads[this.getActiveLeague]) {
        let standings = leagueData.standings.results
        let squads = {}
        this.$store.commit('SET_STANDINGS', standings)

        const promises = standings.forEach(async (player) => {
          squads[player.entry] = []
          await this.$axios
            .$get(`api/entry/${player.entry}/event/${this.getCurrentGW}/picks/`)
            .then((playerTeam) => {
              playerTeam.picks.forEach((footballer) => {
                const id = footballer.element
                const playerInfo = this.getGeneralData.elements.find(
                  (x) => x.id === id
                )
                const teamInfo = this.getGeneralData.teams.find(
                  (x) => x.id === playerInfo.team
                )

                // setting coptain for standings
                if (footballer.is_captain) {
                  player.captain = playerInfo.web_name
                }

                squads[player.entry].push({
                  id: footballer.element,
                  name: playerInfo.web_name,
                  position: playerInfo.element_type,
                  team: teamInfo.short_name,
                  is_captain: footballer.is_captain,
                  is_vice_captain: footballer.is_vice_captain,
                })
              })
            })
        })

        console.log(promises)

        this.$store.commit('SET_SQUADS', squads)
      }
    }
  },
  watch: {
    getActiveLeague(newValue) {
      this.activeTab = 'standings'
      if (!this.getStandings[this.getActiveLeague]) {
        this.$fetch()
      }
    },
  },
}
</script>

<style scoped>
.active-tab {
  @apply bg-green-200 text-gray-700 border-b-4 border-primary;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
