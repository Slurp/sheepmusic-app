import { addItemsAndSortedList } from '@/store/helpers/mutations'
import Vue from 'vue'
import { sortedState, sortedMutations, sortedActions, sortedGetters } from '@/store/helpers/sortedPage'

const state = {
  playlists: [],
  loadedList: false,
  ...sortedState
}

const actions = {
  loadLists({ commit }) {
    Vue.axios.get('/api/playlist_list').then(response => {
      commit('ADD_PLAYLISTS', { playlists: response.data })
    }, err => {
      console.log(err)
    })
  },
  loadSlice({ commit, state }, playlists) {
    return new Promise(resolve => {
      if (state.loadedList === true) {
        resolve(playlists)
      }
    })
  },
  loadPlaylist({ commit, state }, playlistId) {
    if (!state.playlists[playlistId] || !state.playlists[playlistId].songs) {
      Vue.axios.get(`/api/playlist/${state.playlists[playlistId].id}`).then(response => {
        commit('ADD_PLAYLIST', { playlist: response.data, index: playlistId })
      }, err => {
        console.log(err)
      })
    }
  },
  viewPlaylist({ commit }, playlistId) {
    commit('SET_CURRENT_PLAYLIST', { index: playlistId })
  },
  ...sortedActions
}

const mutations = {
  ADD_PLAYLISTS: (state, { playlists }) => {
    addItemsAndSortedList(state, 'playlists', playlists, 'songs')
    state.loadedList = true
  },
  ADD_PLAYLIST: (state, { playlist, index }) => {
    Vue.set(state.playlists, index, playlist)
  },
  SET_CURRENT_PLAYLIST: (state, { index }) => {
    state.currentArtist = state.playlists[index]
  },
  ...sortedMutations
}

const getters = {
  pageNumber: state => state.page,
  totals: state => state.playlists.length,
  slice: state => sortedGetters.getSlice(state, 'playlists'),
  getPlaylistById: state => playlistId => state.playlists[playlistId]
}

const playlists = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default playlists
