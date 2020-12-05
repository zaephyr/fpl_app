export default {
  isLoggedIn: (state) => {
    try {
      return state.authUser.id !== null
    } catch {
      return false
    }
  },
  getSquads: (state) => {
    try {
      return state.squads[state.activeLeague]
    } catch {
      return false
    }
  },
  getActiveLeague: (state) => {
    return state.activeLeague
  },
  getStandings: (state) => {
    console.log(state.standings)
    try {
      return state.standings[state.activeLeague]
    } catch {
      return false
    }
  },
}
