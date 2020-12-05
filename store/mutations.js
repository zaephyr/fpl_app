import initialState from './state'

export default {
  RESET_STORE: (state) => {
    Object.assign(state, initialState())
  },

  SET_AUTH_USER: (state, { authUser }) => {
    state.authUser = {
      uid: authUser.uid,
      email: authUser.email,
    }
  },
  SET_ACTIVE_LEAGUE: (state, payload) => {
    state.activeLeague = payload
  },
  SET_SQUADS: (state, payload) => {
    state.squads[state.activeLeague] = payload
  },
  SET_STANDINGS: (state, payload) => {
    state.standings[state.activeLeague] = payload
  },
}
