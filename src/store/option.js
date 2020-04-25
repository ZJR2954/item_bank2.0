const state = {
  option: JSON.parse(sessionStorage.getItem('$option')) || []
}

const getters = {
  getOption: state => {
    return state.option;
  }
}

const mutations = {
  setOption(state, option) {
    state.option = option;
    sessionStorage.setItem('$option', JSON.stringify(state.option));
  }
}

const actions = {
  saveOption(context, option) {
    context.commit('setOption', option);
  },
  removeOption(context) {
    context.commit('setOption', []);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
