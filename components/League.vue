<template>
  <div class="mt-8 flex flex-col items-center w-full">
    <ul
      class="flex cursor-pointer text-gray-600 border-solid border-b-2 border-green-200 font-bold"
    >
      <li
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'standings' }"
        @click="activeTab = 'standings'"
      >
        Standings
      </li>
      <li
        class="py-2 px-6 rounded-t-lg text-gray-500 bg-gray-200"
        :class="{ 'active-tab': activeTab == 'ownership' }"
        @click="activeTab = 'ownership'"
      >
        Ownership
      </li>
    </ul>

    <p v-if="$fetchState.pending"><LoadingSpinner /></p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <div v-else class="">
      <transition name="fade" mode="out-in">
        <Standings v-if="activeTab == 'standings'" />
        <PlayerOwnership v-if="activeTab == 'ownership'" />
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
export default {
  components: { PlayerOwnership, LoadingSpinner },
  props: {
    generalData: Object,
  },
  data() {
    return {
      gameWeek: 10,
      activeTab: 'standings',
      squads: '',
      standings: '',
    }
  },
  computed: {
    ...mapGetters(['getStandings', 'getActiveLeague', 'getSquads']),
  },
  fetchDelay: 2000,
  async fetch() {
    //so it doesnt do api call if there are standings already
    console.log('sup', this.getStandings)
    if (!this.getStandings) {
      console.log('object')
      await this.$axios
        .$get(`leagues-classic/${this.getActiveLeague}/standings/`)
        .then((res) => {
          console.log('res')
          // doesnt do api call if there are squads already
          if (!this.getSquads) {
            let squads = {}
            let standings = res.standings.results

            standings.forEach((player) => {
              this.$axios
                .$get(`entry/${player.entry}/event/10/picks/`)
                .then((response) => {
                  squads[player.entry] = []
                  response.picks.forEach((footballer) => {
                    const id = footballer.element
                    const playerInfo = this.generalData.elements.find(
                      (x) => x.id === id
                    )
                    const teamInfo = this.generalData.teams.find(
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

                  this.$store.commit('SET_STANDINGS', res.standings.results)

                  this.$store.commit('SET_SQUADS', squads)
                })
            })
          }
        })
    }
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
