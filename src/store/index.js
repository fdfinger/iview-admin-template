import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const state = {
  referer:null
}
const mutations = {
  updateReferer(state, payload){
    state.referer = payload.referer
  }
}
const actions={}
export default new Vuex.Store({
  state,
  mutations,
  actions
})

