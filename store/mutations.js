import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
      username: authUser.displayName,
    }
  },
  SET_FPL_ID: (state, payload) => {
    state.fplID = payload
  },

  SET_CURRENT_GAMEWEEK: (state, payload) => {
    state.currentGW = payload
  },
  SET_GENERAL_DATA: (state, payload) => {
    state.generalData = payload
  },
  SET_ACTIVE_LEAGUE: (state, payload) => {
    state.activeLeague = payload
  },
  SET_ALL_LEAGUES: (state, { standard, freeHit }) => {
    if (!!standard) {
      state.leagueArr = standard
    }
    if (!!freeHit) {
      state.freeHitLeague = freeHit
    }
  },
  SET_SQUADS: (state, payload) => {
    state.squads[state.activeLeague] = payload
  },
  SET_STANDINGS: (state, payload) => {
    state.standings[state.activeLeague] = payload
  },
  SET_DEADLINE: (state, payload) => {
    state.deadline = payload
  },
  SET_CURRENT_GW_CHECKED: (state, payload) => {
    state.currentGW_finished = payload
  },
}
