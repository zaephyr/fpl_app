<template>
  <div class="flex w-full">
    <div class="flex flex-col items-center flex-grow mx-auto">
      <div class="flex justify-between w-1/3 my-4">
        <div class="flex flex-col font-bold">
          <span v-if="isGameWeekFinished" class="text-gray-500 text-xl"
            >Deadline</span
          >
          <span
            :class="[
              isGameWeekFinished ? 'text-primary-light' : 'text-red-400',
            ]"
            class="text-xl w-20 text-center"
          >
            {{ isGameWeekFinished ? getDeadline : 'GameWeek in progress' }}
          </span>
        </div>

        <div class="flex flex-col font-bold">
          <span class="text-gray-500 text-xl">Bank</span>
          <span
            class="text-3xl"
            :class="[bank >= 0 ? 'text-primary-light' : 'text-red-400']"
            >{{ animateBank }}</span
          >
        </div>
        <button class="btn" @click="resetSquad">Reset</button>
      </div>
      <div
        class="flex flex-col img"
        style="
          background-image: url('http://res.cloudinary.com/dxeymvpta/image/upload/c_scale,w_550/v1607595131/fpl-live/football-pitch_hv9zvh.png');
        "
      >
        <div class="flex min-h-1/4">
          <transition name="goalie">
            <div class="player" v-if="!!yourTeam.gkp[0]">
              {{ yourTeam.gkp[0].name }}
              <div class="flex justify-around">
                <fa-icon
                  :icon="['fas', 'copyright']"
                  :class="[
                    captain == yourTeam.gkp[0].id ? 'icon-c-active' : 'icon-c',
                  ]"
                  @click="captain = yourTeam.gkp[0].id"
                />
                <fa-icon
                  :icon="['fas', 'times-circle']"
                  class="icon-x"
                  @click="removePlayer(yourTeam.gkp[0], 'gkp')"
                />
              </div>
            </div>
          </transition>
        </div>

        <transition-group name="position" tag="div" class="flex min-h-1/4">
          <span v-for="def in yourTeam.def" :key="def.id" class="player">
            <span>{{ def.name }}</span>
            <div class="flex justify-around">
              <fa-icon
                :icon="['fas', 'copyright']"
                :class="[captain == def.id ? 'icon-c-active' : 'icon-c']"
                @click="captain = def.id"
              />
              <fa-icon
                :icon="['fas', 'times-circle']"
                class="icon-x"
                @click="removePlayer(def, 'def')"
              />
            </div>
          </span>
        </transition-group>
        <transition-group name="position" tag="div" class="flex min-h-1/4">
          <div v-for="mid in yourTeam.mid" :key="mid.id" class="player">
            <span> {{ mid.name }}</span>
            <div class="flex justify-around">
              <fa-icon
                :icon="['fas', 'copyright']"
                :class="[captain == mid.id ? 'icon-c-active' : 'icon-c']"
                @click="captain = mid.id"
              />
              <fa-icon
                :icon="['fas', 'times-circle']"
                class="icon-x"
                @click="removePlayer(mid, 'mid')"
              />
            </div>
          </div>
        </transition-group>
        <transition-group name="position" tag="div" class="flex min-h-1/4">
          <div v-for="fwd in yourTeam.fwd" :key="fwd.id" class="player">
            <span>{{ fwd.name }}</span>
            <div class="flex justify-around">
              <fa-icon
                :icon="['fas', 'copyright']"
                :class="[captain == fwd.id ? 'icon-c-active' : 'icon-c']"
                @click="captain = fwd.id"
              />
              <fa-icon
                :icon="['fas', 'times-circle']"
                class="icon-x"
                @click="removePlayer(fwd, 'fwd')"
              />
            </div>
          </div>
        </transition-group>
      </div>
      <div class="mx-auto min-h-2 text-red-500 font-bold">{{ errMsg }}</div>

      <div class="flex justify-around w-1/3" v-if="getUsername">
        <button
          :class="[isDisabled ? 'btn-disabled' : 'btn']"
          @click="submitTeam"
          :disabled="isDisabled"
        >
          Submit Team
        </button>
        <button class="btn" @click="getSubmitedTeam">Get Saved Team</button>
      </div>

      <p v-else>You need to have an username to save a team!</p>
    </div>

    <div class="w-72 mt-4">
      <div class="w-4/5">
        <label class="font-semibold" for="position">View</label>

        <select class="dropdown" name="position" v-model="view" id="position">
          <option value="all" selected>All players</option>
          <option value="goalkeepers">Goalkeepers</option>
          <option value="defenders">Defenders</option>
          <option value="midfielders">Midfielders</option>
          <option value="forwards">Forwards</option>
          <option v-for="team in teams" :key="team.id" :value="team.short_name">
            {{ team.name }}
          </option>
        </select>
      </div>
      <div class="w-4/5">
        <label class="font-semibold" for="sort">Sort by</label>
        <select class="dropdown" name="sort" v-model="sorted" id="sort">
          <option value="score" selected>Total score</option>
          <option value="price">Price</option>
        </select>
      </div>
      <transition-group name="selection" tag="div">
        <tr
          v-for="player in players.slice(playersRange - 20, playersRange)"
          :key="player.id"
          class="cursor-pointer onchange text-sm text-gray-500"
          @click="addPlayer(player)"
        >
          <td class="w-32 font-bold">{{ player.web_name }}</td>

          <td class="w-12">
            {{ teams.find((el) => el.id == player.team).short_name }}
          </td>
          <td class="w-12" :class="{ 'font-bold': sorted == 'price' }">
            £{{ parseFloat(player.now_cost) / 10 }}
          </td>
          <td :class="{ 'font-bold': sorted == 'score' }">
            {{ player.total_points }}
          </td>
        </tr>
      </transition-group>
      <div class="flex justify-evenly w-4/5 mt-4 text-center">
        <button :disabled="playersRange <= 20" @click="previous">
          <fa-icon
            :icon="['fas', 'chevron-left']"
            :class="[!(playersRange <= 20) ? 'icon-page' : 'opacity-30']"
          />
        </button>

        <span
          >{{ playersRange / 20 }} / {{ Math.ceil(players.length / 20) }}</span
        >
        <button :disabled="playersRange > players.length" @click="next">
          <fa-icon
            :icon="['fas', 'chevron-right']"
            :class="[
              !(playersRange > players.length) ? 'icon-page' : 'opacity-30',
            ]"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      view: 'all',
      sorted: 'score',
      playersRange: 20,
      players: null,
      teams: null,
      pickedFromTeams: [],
      captain: null,
      yourTeam: {
        gkp: [],
        def: [],
        mid: [],
        fwd: [],
      },
      teamSize: 0,
      bank: 83,
      tweenedNumber: 83,
      errMsg: '',
      isDisabled: true,
    }
  },

  created() {
    this.players = this.getPlayers
    this.players.sort((a, b) => {
      return parseInt(b.total_points) - parseInt(a.total_points)
    })
    this.teams = this.getTeams
    if (!this.isGameWeekFinished) {
      this.errMsg = "Can't submit the squad during active game week!"
    }
  },
  computed: {
    ...mapGetters([
      'getPlayers',
      'getTeams',
      'getUsername',
      'getCurrentGW',
      'getFreeHitLeague',
      'getDeadline',
      'isGameWeekFinished',
    ]),
    animateBank() {
      return this.tweenedNumber.toFixed(1)
    },
  },
  watch: {
    bank(newValue) {
      gsap.to(this.$data, { duration: 0.7, tweenedNumber: newValue })
    },
    view(newVal) {
      if (newVal == 'all') {
        this.players = this.getPlayers
      } else if (newVal == 'goalkeepers') {
        this.players = this.getPlayers
        this.players = this.players.filter((el) => el.element_type == 1)
      } else if (newVal == 'defenders') {
        this.players = this.getPlayers
        this.players = this.players.filter((el) => el.element_type == 2)
      } else if (newVal == 'midfielders') {
        this.players = this.getPlayers
        this.players = this.players.filter((el) => el.element_type == 3)
      } else if (newVal == 'forwards') {
        this.players = this.getPlayers
        this.players = this.players.filter((el) => el.element_type == 4)
      } else {
        this.players = this.getPlayers
        let teamID = this.teams.find((el) => el.short_name == newVal).id

        this.players = this.players.filter((el) => el.team == teamID)
      }
      this.sortPlayers()
    },
    sorted(newVal) {
      this.sortPlayers()
    },
    teamSize(newVal) {
      if (newVal == 11 && this.isGameWeekFinished) {
        this.isTeamViable()
      } else {
        this.isDisabled = true
      }
    },
    captain(newVal) {
      if (this.teamSize == 11 && this.isGameWeekFinished) {
        this.isTeamViable()
      }
    },
  },
  methods: {
    fromSameTeam(val) {
      return this.pickedFromTeams.filter((el) => el == val)
    },
    isPickViable(obj) {
      if (
        this.yourTeam[this.playerPosition(obj.element_type)].find(
          (el) => el.id == obj.id
        )
      ) {
        this.errMsg = `You already picked ${obj.web_name}!`
        return false
      } else if (this.teamSize >= 11) {
        this.errMsg = `Squad is full. You need to remove a player to add ${obj.web_name}!`
        return false
      } else if (this.fromSameTeam(obj.team).length >= 3) {
        const team = this.getTeams.find((el) => el.id == obj.team)
        this.errMsg = `You already have THREE players from ${team.name}. `
        return false
      } else if (obj.element_type == 1 && this.yourTeam.gkp.length != 0) {
        this.errMsg = `Only ONE goalkeeper allowed`
        return false
      } else if (obj.element_type == 2 && this.yourTeam.def.length >= 5) {
        this.errMsg = 'Maximum of FIVE defenders allowed'
        return false
      } else if (obj.element_type == 3 && this.yourTeam.mid.length >= 5) {
        this.errMsg = 'Maximum of FIVE midfielders allowed'
        return false
      } else if (obj.element_type == 4 && this.yourTeam.fwd.length >= 3) {
        this.errMsg = 'Maximum of THREE forwards allowed'
        return false
      } else {
        this.errMsg = ''
        return true
      }
    },
    isTeamViable() {
      if (!this.yourTeam.gkp) {
        this.errMsg = 'Goalkeeper must be picked'
      } else if (this.yourTeam.def.length < 3) {
        this.errMsg = 'Atleast THREE defenders required'
      } else if (this.yourTeam.mid.length < 2) {
        this.errMsg = 'Atleast TWO midfielders required'
      } else if (this.yourTeam.fwd.length < 1) {
        this.errMsg = 'Atleast ONE forward required'
      } else if (!this.captain) {
        this.errMsg = 'Captain must be picked'
      } else if (this.bank < 0) {
        this.errMsg = 'Team value must be within limit'
      } else {
        this.errMsg = ''

        this.isDisabled = false
      }
    },
    addPlayer(obj) {
      if (this.isPickViable(obj)) {
        this.pickedFromTeams.push(obj.team)
        this.teamSize += 1
        this.errMsg = ''
        const player = {
          id: obj.id,
          team: this.teams.find((el) => el.id == obj.team).short_name,
          teamID: obj.team,
          name: obj.web_name,
          position: obj.element_type,
          price: this.roundToOne(parseFloat(obj.now_cost) / 10),
        }
        this.bank = this.roundToOne(this.bank - parseFloat(obj.now_cost) / 10)
        this.yourTeam[this.playerPosition(obj.element_type)].push(player)
      }
    },
    removePlayer(player, position) {
      let index = this.yourTeam[position].indexOf(player)
      this.yourTeam[position].splice(index, 1)

      this.bank = this.roundToOne(this.bank + player.price)

      index = this.pickedFromTeams.lastIndexOf(player.teamID)
      this.pickedFromTeams.splice(index, 1)

      this.teamSize -= 1
    },
    sortPlayers() {
      this.playersRange = 20
      if (this.sorted == 'score') {
        this.players.sort((a, b) => {
          return parseInt(b.total_points) - parseInt(a.total_points)
        })
      } else if (this.sorted == 'price') {
        this.players.sort((a, b) => {
          return parseInt(b.now_cost) - parseInt(a.now_cost)
        })
      }
    },
    playerPosition(val) {
      val = parseInt(val)
      switch (val) {
        case 1:
          return 'gkp'
        case 2:
          return 'def'
        case 3:
          return 'mid'
        case 4:
          return 'fwd'
      }
    },
    resetSquad() {
      this.pickedFromTeams = []
      this.teamSize = 0
      this.errMsg = ''
      this.bank = 83
      this.yourTeam = {
        gkp: [],
        def: [],
        mid: [],
        fwd: [],
      }
    },
    roundToOne(num) {
      return +(Math.round(num + 'e+1') + 'e-1')
    },
    next() {
      this.playersRange = this.playersRange + 20
    },
    previous() {
      this.playersRange = this.playersRange - 20
    },

    submitTeam() {
      let teamArr = []
      for (const [key, value] of Object.entries(this.yourTeam)) {
        value.forEach((el) => teamArr.push(el))
      }

      const fhLeague = this.$fire.firestore
        .collection('freeHitLeagues')
        .doc(this.getFreeHitLeague)
      const squadArr = fhLeague
        .get()
        .then((doc) => {
          if (doc.exists) {
            const squadArr = doc.data().squads

            const fhSquadData = {
              user: this.getUsername,
              gameweek: this.getCurrentGW + 1,
              team: teamArr,
              captain: this.captain,
            }
            if (squadArr.some((el) => el.user == this.getUsername)) {
              const index = squadArr.findIndex(
                (el) => el.user == this.getUsername
              )
              squadArr.splice(index, 1)
            }

            squadArr.push(fhSquadData)

            fhLeague
              .update({
                squads: squadArr,
              })
              .then(() => {
                this.errMsg = 'Squad saved!'
              })
              .catch((err) => {
                this.errMsg = 'Error: ' + err
              })
          } else {
            this.errMsg = 'Unknown error!'
          }
        })
        .catch((err) => {
          this.errMsg = 'Error: ' + err
        })
    },
    async getSubmitedTeam() {
      const team = await this.$fire.firestore
        .collection('freeHitLeagues')
        .doc(this.getFreeHitLeague)
      const teamDoc = team
        .get()
        .then((doc) => {
          if (doc.exists) {
            this.resetSquad()
            this.bank = 0
            return doc
              .data()
              .squads.find((team) => team.user == this.getUsername)
          }
        })
        .then((squad) => {
          squad.team.forEach((player) => {
            this.yourTeam[this.playerPosition(player.position)].push(player)
          })
          this.captain = squad.captain
        })
        .catch((err) => {
          this.errMsg = "You haven't submited the team yet!"
        })
    },
  },
}
</script>

<style>
.img {
  width: 550px;
  height: 420px;
}
.player {
  @apply mx-auto my-auto p-1 bg-gray-50 rounded-lg text-gray-500 font-bold text-center transition-all duration-1000;
  min-width: 3rem;
}

.icon-x {
  @apply text-red-400 cursor-pointer;
}

.icon-c {
  @apply opacity-50  cursor-pointer;
}

.icon-c-active {
  @apply cursor-pointer text-primary;
}

.icon-page {
  @apply cursor-pointer text-primary my-auto;
}
.position-enter,
.position-leave-to,
.selection-enter,
.selection-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.position-leave-active {
  position: absolute;
  right: 30%;
}

.selection-leave-active {
  position: absolute;
  top: 20%;
}

.goalie-enter-active,
.goalie-leave-active {
  transition: opacity 0.5s;
}
.goalie-enter,
.goalie-leave-to {
  opacity: 0;
}
</style>
