<template>
  <div>
    <DashHeader :user="user" />
    <div class="flex">
      <DashSideBar :user="user" :userData="userData" />
      <League v-if="isLeagueActive" :generalData="generalData" />
    </div>
    <ProfileInfo :user="user" :userData="userData" />
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
      },
    }
  },
  async asyncData({ $axios }) {
    try {
      const generalData = await $axios.$get('bootstrap-static/')
      return { generalData }
    } catch (error) {
      console.log(error)
    }
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
          }
        })
        .catch(function (error) {
          console.log('Error getting document:', error)
        })
    })
  },
  computed: {
    isLeagueActive() {
      return this.$store.getters.getActiveLeague
    },
  },
}
</script>

<style></style>
