<template>
  <div class="flex flex-col sm:flex-row">
    <div class="h-screen bg-white">
      <nav class="mt-10">
        <transition v-if="!userData.username" name="tab-fade" mode="out-in">
          <button
            v-if="!usernameShow"
            class="side-tab"
            @click="
              ;(usernameShow = true),
                (fplUserShow = false),
                (leagueShow = false)
            "
          >
            <span class="mx-auto font-medium"> Add Username </span>
          </button>
          <div v-else class="flex w-48 bg-green-200">
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'plus']"
              @click="addUsername"
            />
            <input
              v-model="user.displayName"
              class="form-cell"
              id="username"
              name="username"
              required
              type="text"
              placeholder="Username"
            />
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'times']"
              @click="usernameShow = false"
            />
          </div>
        </transition>
        <transition name="tab-fade" mode="out-in">
          <button
            v-if="!fplUserShow"
            class="side-tab"
            @click="
              ;(fplUserShow = true),
                (usernameShow = false),
                (leagueShow = false)
            "
          >
            <span class="mx-auto">FPL UserID</span
            ><span v-if="userData.fplID" class="text-primary text-md font-bold"
              >: {{ userData.fplID }}</span
            >
          </button>
          <div v-else class="flex w-48 mt-5 bg-green-200">
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'plus']"
              @click="addFplID"
            />
            <input
              v-model="userData.fplID"
              class="form-cell inline-block"
              id="fplID"
              name="User ID"
              required
              type="text"
              placeholder="FPL ID"
            />
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'times']"
              @click="fplUserShow = false"
            />
          </div>
        </transition>

        <transition name="tab-fade" mode="out-in">
          <button
            v-if="!leagueShow"
            class="side-tab"
            @click="
              ;(leagueShow = true),
                (usernameShow = false),
                (fplUserShow = false)
            "
          >
            <span class="mx-auto font-medium">Add League</span>
          </button>
          <div v-else class="flex w-48 mt-5 bg-green-200">
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'plus']"
              @click="addLeague"
            />
            <input
              v-model="userData.league"
              class="form-cell inline-block"
              id="league"
              name="League ID"
              required
              type="text"
              placeholder="League ID"
            />
            <fa-icon
              class="text-md text-primary my-auto cursor-pointer mx-1"
              :icon="['fas', 'times']"
              @click="leagueShow = false"
            />
          </div>
        </transition>
        <p
          class="w-48 pl-2 text-center"
          :class="[submitMsg.bool ? 'text-primary' : 'text-red-400']"
        >
          <span v-html="submitMsg.msg"></span>
        </p>

        <div class="mt-16" v-if="userData.fplLeagues[0]">
          <span class="text-primary font-bold text-xl ml-4"
            >Your Leagues:
          </span>
          <button
            v-for="league in userData.fplLeagues"
            :key="league.id"
            class="side-tab"
            :class="{
              'league-active': getActiveLeague === league.id,
            }"
            @click="selectLeague(league.id)"
          >
            <span class="mx-auto font-bold">{{ league.name }}</span>
          </button>
        </div>
        <div class="mt-20" v-if="getFreeHitLeague">
          <button
            class="side-tab"
            :class="{
              'league-active': getActiveLeague === 'freeHit',
            }"
            @click="selectLeague('freeHit')"
          >
            <span class="mx-auto font-bold">Free Hit League</span>
          </button>
        </div>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['user', 'userData'],
  data() {
    return {
      usernameShow: false,
      fplUserShow: false,
      leagueShow: false,
      submitMsg: {
        bool: null,
        msg: ``,
      },
    }
  },
  watch: {
    submitMsg(newVal) {
      setTimeout(() => {
        this.submitMsg = {
          bool: null,
          msg: '',
        }
      }, 5000)
    },
  },
  computed: {
    ...mapGetters(['getActiveLeague', 'getUsername', 'getFreeHitLeague']),
  },
  methods: {
    async addUsername() {
      try {
        this.$fire.auth.currentUser
          .updateProfile({
            displayName: this.user.displayName,
          })
          .then((user) => {
            console.log('success')
            this.userData.username = this.user.displayName
            this.$router.push({ path: '/dashboard' })
          })
      } catch (error) {
        this.submitMsg = { bool: false, msg: error.message }
        console.log(error)
      }
    },
    async addFplID() {
      const fplID = this.$fire.firestore
        .collection('users')
        .doc(`${this.user.uid}`)
      try {
        await fplID.update({
          fplID: this.userData.fplID,
        })
        this.submitMsg = { bool: true, msg: 'Fpl ID saved!' }
      } catch (error) {
        this.submitMsg = { bool: false, msg: error.message }

        alert(error)
      }
    },
    async addLeague() {
      const fplID = this.$fire.firestore
        .collection('users')
        .doc(`${this.user.uid}`)

      if (!!parseInt(this.userData.league)) {
        await this.$axios
          .$get(`api/leagues-classic/${this.userData.league}/standings/`)
          .then((leagueData) => {
            try {
              const saveLeague = {
                id: this.userData.league,

                name: leagueData.league.name,
              }
              this.userData.fplLeagues.push(saveLeague)

              fplID.update({
                leagues: this.userData.fplLeagues,
              })

              this.submitMsg = { bool: true, msg: 'New fpl league added!' }
            } catch (error) {
              this.submitMsg = { bool: false, msg: 'Somethings went wrong!' }
              return Promise.reject(error)
            }
          })
          .catch((err) => {
            this.submitMsg = { bool: false, msg: "ID doesn't exist" }
          })
      } else if (this.getUsername || this.userData.username) {
        const fhLeague = this.$fire.firestore
          .collection('freeHitLeagues')
          .doc(`${this.userData.league}`)

        const leagueExists = await fhLeague.get()
        if (leagueExists.exists) {
          this.userData.freeHitLeague = this.userData.league

          try {
            await fplID.update({
              freeHitLeague: this.userData.freeHitLeague,
            })

            const allLeagues = {
              standard: this.userData.fplLeagues,
              freeHit: this.userData.freeHitLeague,
            }

            this.$store.commit('SET_ALL_LEAGUES', allLeagues)
          } catch (error) {
            return Promise.reject(error)
          }

          try {
            await fhLeague.update({
              standings: this.$fireModule.firestore.FieldValue.arrayUnion({
                captain: '',
                entry_name: this.getUsername ?? this.userData.username,
                event_total: 0,
                total: 0,
              }),
            })
          } catch (error) {
            return Promise.reject(error)
          }

          this.submitMsg = {
            bool: true,
            msg: `Joined the<br/> >> ${this.userData.league} <br/><< Free Hit League!`,
          }
        } else {
          this.submitMsg = {
            bool: false,
            msg: 'There is no free hit <br/> league with that name!',
          }
        }
      } else {
        this.submitMsg = {
          bool: false,
          msg: 'Username is required <br/> for joining Free Hit League',
        }
      }
    },
    async selectLeague(val) {
      this.$store.commit('SET_ACTIVE_LEAGUE', val)
      this.$fetch
    },
  },
}
</script>

<style lang="scss">
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.6s;
}

.tab-fade-enter-from,
.tab-fade-leave-to {
  opacity: 0;
}
</style>
