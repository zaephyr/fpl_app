<template>
  <div>
    <DashHeader :user="user" />
    <div class="flex">
      <DashSideBar :user="user" :userData="userData" />
      <League v-if="$store.getters.getActiveLeague" />
    </div>
  </div>
</template>

<script>
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
    await this.$axios.$get('bootstrap-static/').then((res) => {
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
}
</script>

<style></style>
