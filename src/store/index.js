import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

const state = {
    isLoading:false,
    formDisabled:false,
    includeds: '',
    parensCash:'RemoteConsultation'
}

const getters = {

}

const mutations = {
    updateLoadingStatus(state,payload){
        state.isLoading = payload.isLoading;
    },
    updateFormDisabled(state,payload){
        state.formDisabled = payload;
    },
    setIncludeds(state,setdata){
        state.includeds = setdata;
    },
    setParensCash(state,setdata){
        state.parensCash = setdata;
    },
    
}

const actions = {

}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})