const state = {
  user: JSON.parse(sessionStorage.getItem('$user')) || {},
  userType: JSON.parse(sessionStorage.getItem('$userType')) || {}
}

const getters = {
  getUser: state => {
    return state.user;
  },
  getUserType: state => {
    return state.userType;
  }
}

const mutations = {
  setUser(state, user) {
    state.user = user;
    sessionStorage.setItem('$user', JSON.stringify(state.user));
  },
  setUserType(state, userType) {
    state.userType = userType;
    sessionStorage.setItem('$userType', JSON.stringify(state.userType));
  }
}

const actions = {
  saveUser(context, user) {
    context.commit('setUser', user);
  },
  saveUserType(context, userType) {
    context.commit('setUserType', userType);
  },
  removeUser(context) {
    context.commit('setUser', {});
    context.commit('setUserType', {});
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
