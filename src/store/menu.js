const state = {
  menu: JSON.parse(sessionStorage.getItem('$menu')) || []
}

const getters = {
  getMenu: state => {
    return state.menu;
  }
}

const mutations = {
  setMenu(state, menu) {
    state.menu = menu;
    sessionStorage.setItem('$menu', JSON.stringify(state.menu));
  }
}

const actions = {
  saveMenu(context, menu) {
    context.commit('setMenu', menu);
  },
  removeMenu(context) {
    context.commit('setMenu', []);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
