import Vue from 'vue'

const state = {
  playlists: [],
  sortedList: [],
  currentArtist: null,
  page: 1,
  sortBy: 'all'
}

const actions = {
  loadPlaylists({ commit }) {
    Vue.axios.get('/api/playlist_list').then(response => {
      commit('ADD_PLAYLISTS', { playlists: response.data })
    }, err => {
      console.log(err)
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
  paginate({ commit }, page) {
    commit('PAGINATE', { page })
  },
  sortBy({ commit }, sort) {
    commit('SORT_BY', { sort })
  }
}

const mutations = {
  ADD_PLAYLISTS: (state, { playlists }) => {
    state.playlists = playlists
    state.sortedList = state.playlists.map(playlist => ({ id: playlist.id, date: new Date(playlist.createdAt.date) }))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    }
  },
  ADD_PLAYLIST: (state, { playlist, index }) => {
    Vue.set(state.playlists, index, playlist)
  },
  SET_CURRENT_PLAYLIST: (state, { index }) => {
    state.currentArtist = state.playlists[index]
  },
  PAGINATE: (state, { page }) => {
    state.page = page
  },
  SORT_BY: (state, { sort }) => {
    if (sort !== state.sortBy) {
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else {
        state.sortedList.sort((a, b) => a.id - b.id)
      }
      state.sortBy = sort
    }
  }
}

const getters = {
  pageNumber: state => state.page,
  totalPlaylists: state => state.playlists.length,
  getPlaylists: state => {
    if (state.playlists.length >= 12) {
      const start = (12 * (state.page - 1)) + 1
      return state.sortedList.slice(start, start + 12).map(playlist => state.playlists[playlist.id])
    }
    return state.playlists
  },
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
