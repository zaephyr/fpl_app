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
        v-if="getActiveLeague == 'freeHit'"
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'pickTeam' }"
        @click="activeTab = 'pickTeam'"
      >
        Pick A Team
      </li>
    </ul>

    <div class="w-full" :class="{ 'flex justify-center': loading }">
      <LoadingSpinner v-if="loading && $fetch.pending" class="mt-16" />
      <p v-else-if="$fetchState.error">An error occurred :(</p>
      <transition v-else name="fade" mode="out-in">
        <Standings v-if="activeTab == 'standings'" />
        <PlayerOwnership v-else-if="activeTab == 'ownership'" />
        <PickTeam v-else-if="activeTab == 'pickTeam'" />
      </transition>
    </div>
    <button class="btn" @click="$fetch">Fetch data</button>
  </div>
</template>

<script>
import { formatRelative } from 'date-fns'
import PlayerOwnership from './PlayerOwnership.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { mapGetters } from 'vuex'
import { clearConfigCache } from 'prettier'
export default {
  components: { PlayerOwnership, LoadingSpinner },
  data() {
    return {
      gameWeek: 11,
      activeTab: 'standings',
      loading: false,
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
    ]),
  },
  fetchDelay: 2000,
  fetch() {
    //so it doesnt do api call if there are standings already

    if (this.getActiveLeague == 'freeHit') {
      const fhteam = this.$fire.firestore
        .collection('freeHitLeagues')
        .doc(this.getFreeHitLeague)

      fhteam.get().then((doc) => {
        if (doc.exists) {
          const squads = doc.data().squads
          let standings = doc.data().standings
          let gw = doc.data().gw

          let newStandings = []
          if (gw == this.getCurrentGW - 1) {
            squads
              .forEach((squad) => {
                let team = standings.find((el) => {
                  el.entry_name == squad.user
                })

                team = !!team
                  ? team
                  : {
                      captain: '',
                      event_total: 0,
                      total: 0,
                      entry_name: this.getUsername,
                    }

                let players = this.$store.getters.getPlayers
                let captain = players.find((el) => {
                  return el.id == squad.captain
                })

                let gwScore = captain.event_points

                squad.team.forEach((el) => {
                  const playerScore = players.find((player) => {
                    return player.id == el.id
                  }).event_points
                  gwScore += playerScore
                })

                team.captain = captain.web_name
                team.event_total = gwScore
                team.total += gwScore
                newStandings.push(team)
              })
              .then((standings) => {
                fhteam
                  .update({
                    standings: standings,
                  })
                  .catch((err) => console.log('Error: ' + err))
              })

            return newStandings
          } else {
            this.$store.commit('SET_STANDINGS', standings)
          }
        }
      })
    } else if (!this.getStandings[this.getActiveLeague]) {
      this.loading = true
      this.$axios
        .$get(`leagues-classic/${this.getActiveLeague}/standings/`)
        .then((res) => {
          // doesnt do api call if there are squads already
          if (!this.getSquads[this.getActiveLeague]) {
            let squads = {}
            let standings = res.standings.results

            this.$store.commit('SET_STANDINGS', standings)

            standings.forEach((player) => {
              this.$axios
                .$get(`entry/${player.entry}/event/${this.getCurrentGW}/picks/`)
                .then((response) => {
                  squads[player.entry] = []
                  response.picks.forEach((footballer) => {
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

                  this.$store.commit('SET_SQUADS', squads)
                })

                .catch((err) => {
                  console.log('Error :' + err)
                })
            })
          }
        })
        .then(() => {
          this.loading = false
        })
        .catch((err) => {
          console.log('Error :' + err)
        })
    }
  },
  watch: {
    getActiveLeague(newValue) {
      this.activeTab = 'standings'
      this.$fetch
    },
    loading(newValue) {
      console.log('loading ' + newValue)
    },
  },
  methods: {
    deadlineDate(date) {
      let now = new Date(Date.now()).toISOString()

      return formatRelative(date, now)
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
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
