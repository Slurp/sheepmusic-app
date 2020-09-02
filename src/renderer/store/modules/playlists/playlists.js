import { addItemsAndSortedList } from '@/store/helpers/mutations'
import Vue from 'vue'
import { sortedState, sortedMutations, sortedActions, sortedGetters } from '@/store/helpers/sortedPage'

const state = {
  playlists: [],
  loadedList: false,
  ...sortedState
}

const actions = {
  async loadLists({ commit, state }) {
    commit('SET_LOADED');
    return new Promise((resolve, reject) => {
      Vue.axios.get('/api/playlist_list').then(response => {
        if (response.data.length !== state.playlists.length) {
          commit('ADD_PLAYLISTS', { playlists: response.data })
          resolve()
        }
      }, err => {
        reject(err)
      })
    })
  },
  async loadSlice({ commit, state }, playlists) {
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
  SET_LOADED: (state  ) => {
    state.loadedList = true
  },
  ADD_PLAYLISTS: (state, { playlists }) => {
    addItemsAndSortedList(state, 'playlists', playlists, 'songs')
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
  getPlaylistById: state => playlistId => state.playlists[playlistId],
  isLoaded: state => state.loadedList
}

const playlists = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default playlists
