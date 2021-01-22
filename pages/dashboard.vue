<template>
  <div>
    <DashHeader :user="user" />
    <div class="flex">
      <DashSideBar :user="user" :userData="userData" />
      <League v-if="getActiveLeague" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      user: '',
      userData: {
        username: '',
        fplID: '',
        league: '',
        fplLeagues: [],
        freeHitLeague: [],
      },
    }
  },
  async fetch() {
    await this.$axios
      .$get('api/bootstrap-static/')
      .then((res) => {
        const currGW = res.events.find((gw) => {
          return gw.is_current
        })
        const nextGW = res.events.find((gw) => {
          return gw.is_next
        })
        this.$store.commit('SET_DEADLINE', nextGW.deadline_time_epoch)
        this.$store.commit('SET_CURRENT_GAMEWEEK', currGW.id)
        this.$store.commit('SET_CURRENT_GW_CHECKED', currGW.finished)
        this.$store.commit('SET_GENERAL_DATA', res)
      })
      .then(() => {
        const fhLeague = this.$fire.firestore
          .collection('freeHitLeagues')
          .doc(this.getFreeHitLeague)

        const fhLeagueData = fhLeague.get().then((doc) => {
          const gw = doc.data().gw
          const squads = doc.data().squads
          const standings = doc.data().standings
          console.log(gw)
          if (this.isGameWeekFinished && this.getCurrentGW == gw) {
            console.log('Standings update!')
            this.standingsUpdate(squads, standings, fhLeague)
          } else if (this.getCurrentGW > gw) {
            console.log('sup')
            this.standingsUpdate(squads, standings, fhLeague)
          }
        })
      })
  },
  mounted() {
    this.$fire.auth.onAuthStateChanged((user) => {
      this.user = user
      this.userData.username = user.displayName

      const db = this.$fire.firestore
      db.collection('users')
        .doc(`${user.uid}`)
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.userData.fplID = doc.data().fplID
            this.userData.fplLeagues = doc.data().leagues
            this.userData.freeHitLeague = doc.data().freeHitLeague

            const allLeagues = {
              standard: this.userData.fplLeagues,
              freeHit: this.userData.freeHitLeague,
            }

            this.$store.commit('SET_ALL_LEAGUES', allLeagues)
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error)
        })
    })
  },
  computed: {
    ...mapGetters([
      'getActiveLeague',
      'getFreeHitLeague',
      'getPlayers',
      'isGameWeekFinished',
      'getCurrentGW',
    ]),
  },
  methods: {
    standingsUpdate(squads, standings, fhLeague) {
      squads.forEach((squad) => {
        let team = standings.find((el) => el.entry_name == squad.user)
        let teamIndex = standings.findIndex((el) => el.entry_name == squad.user)

        let players = this.getPlayers
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
        standings[teamIndex] = team
      })

      fhLeague.update({
        gw: 20,
        standings: standings,
        squads: [],
      })
    },
  },
}
</script>

<style></style>
