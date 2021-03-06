import { fromUnixTime } from 'date-fns'

export default {
  isLoggedIn: (state) => {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  getUsername: (state) => {
    try {
      return state.authUser.username
    } catch (error) {
      return false
    }
  },
  getCurrentGW: (state) => {
    try {
      return state.currentGW
    } catch (error) {
      return false
    }
  },
  getFplID: (state) => {
    try {
      return state.fplID
    } catch (error) {
      return false
    }
  },
  getGeneralData: (state) => {
    try {
      return state.generalData
    } catch (error) {
      return false
    }
  },
  getPlayers: (state) => {
    try {
      return state.generalData.elements
    } catch (error) {
      return false
    }
  },
  getFreeHitLeague: (state) => {
    try {
      return state.freeHitLeague
    } catch (error) {
      return false
    }
  },
  getTeams: (state) => {
    try {
      return state.generalData.teams
    } catch (error) {
      return false
    }
  },
  getSquads: (state) => {
    try {
      return state.squads
    } catch {
      return false
    }
  },
  getActiveLeague: (state) => {
    return state.activeLeague
  },
  getStandings: (state) => {
    try {
      return state.standings
    } catch {
      return false
    }
  },
  getDeadline: (state) => {
    try {
      let deadlineDate = fromUnixTime(state.deadline)
      deadlineDate = deadlineDate.toString().split(' ')
      deadlineDate = deadlineDate[2] + '. ' + deadlineDate[1]

      return deadlineDate
    } catch {
      return false
    }
  },
  isGameWeekFinished: (state) => {
    try {
      return state.currentGW_finished
    } catch {
      return false
    }
  },
}
