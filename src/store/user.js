const state = {
  user: JSON.parse(sessionStorage.getItem('$user')) || {},
  userType: JSON.parse(sessionStorage.getItem('$userType')) || {},
  schoolId: JSON.parse(sessionStorage.getItem('$schoolId')) || null,
  facultyId: JSON.parse(sessionStorage.getItem('$facultyId')) || null
}

const getters = {
  getUser: state => {
    return state.user;
  },
  getUserType: state => {
    return state.userType;
  },
  getSchoolId: state => {
    return state.schoolId;
  },
  getFacultyId: state => {
    return state.facultyId;
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
  },
  setSchoolId(state, schoolId) {
    state.schoolId = schoolId;
    sessionStorage.setItem('$schoolId', JSON.stringify(state.schoolId));
  },
  setFacultyId(state, facultyId) {
    state.facultyId = facultyId;
    sessionStorage.setItem('$facultyId', JSON.stringify(state.facultyId));
  }
}

const actions = {
  saveUser(context, user) {
    context.commit('setUser', user);
  },
  saveUserType(context, userType) {
    context.commit('setUserType', userType);
  },
  saveSchoolId(context, schoolId) {
    context.commit('setSchoolId', schoolId);
  },
  saveFacultyId(context, facultyId) {
    if(facultyId == undefined) {
      context.commit('setFacultyId', null);
    }else {
      context.commit('setFacultyId', facultyId);
    }
  },
  removeUser(context) {
    context.commit('setUser', {});
    context.commit('setUserType', {});
    context.commit('setSchoolId', null);
    context.commit('setFacultyId', null);
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
