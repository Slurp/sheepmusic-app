import { maybe } from '@/services/functional-tools'
import Vue from 'vue'

const state = {
  songs: [],
  repeatModes: ['NO_REPEAT', 'REPEAT_ALL', 'REPEAT_ONE'],
  repeatMode: 'REPEAT_ALL',
  currentIndex: null,
  currentSong: null,
  isPlaying: false,
  isPaused: false,
  name: ''
}

const actions = {
  async nextSong({ commit }) {
    commit('NEXT')
  },
  async prevSong({ commit }) {
    commit('PREV')
  },
  async clearPlaylist({ commit }) {
    commit('CLEAR')
  },
  async queueAlbum({ commit }, album) {
    commit('ADD_ALBUM', { album })
  },
  async playAlbum({ dispatch, commit }, album) {
    await dispatch('clearPlaylist')
    commit('ADD_ALBUM', { album })
    commit('NEXT')
  },
  async queueSong({ commit }, song) {
    commit('ADD_SONG', { song })
  },
  async playSong({ dispatch, commit }, song) {
    await dispatch('clearPlaylist')
    commit('ADD_SONG', { song })
    commit('NEXT')
  },
  async selectSong({ commit }, index) {
    commit('SELECT_SONG', { index })
  },
  removeSong({ commit }, index) {
    commit('REMOVE_SONG', { index })
  },
  shuffle({ commit }) {
    commit('SHUFFLE')
  },
  setPlayingStatus({ commit }, playing) {
    commit('PLAYING', { playing })
  },
  setTitle({ commit }, title) {
    console.log(title)
    commit('SAVE', { title })
  },
  setRepeatMode({ commit }, mode) {
    commit('SET_REPEAT_MODE', { mode })
  },
  async savePlaylist({ commit }, title) {
    const data = new FormData()
    data.append('name', title)
    for (const song of state.songs) {
      data.append('songs[]', song.id)
    }

    return Vue.axios.post('/api/save/playlist', data).then(response => {
      commit('SAVE', { title: response.name })
      return response
    }).catch(e => (e))
  },
  async updateList({ commit }, sortedList) {
    commit('UPDATE_LIST', { list: sortedList })
  },
  async clear({ commit }) {
    commit('CLEAR')
  }
}

const mutations = {
  CLEAR: state => {
    console.log('clear')
    state.songs = []
    state.currentIndex = null
    state.currentRepeatMode = 'REPEAT_ALL'
    state.name = null
  },
  PREV: state => {
    if (state.repeatMode !== 'REPEAT_ONE') {
      if (state.currentIndex === null || state.currentIndex === 0) {
        state.currentIndex = state.songs.length
      }
      state.currentIndex--
    }
    state.currentSong = state.songs[state.currentIndex]
  },
  NEXT: state => {
    if (state.repeatMode === 'REPEAT_ONE') {
      state.currentSong = state.songs[state.currentIndex]
    } else {
      if (state.currentIndex !== null) {
        state.currentIndex++
      }
      if (state.currentIndex === null || state.currentIndex >= state.songs.length) {
        if (state.currentIndex >= state.songs.length && state.repeatMode !== 'REPEAT_ALL') {
          state.isPlaying = false
        } else {
          state.currentIndex = 0
        }
      }
      state.currentSong = state.songs[state.currentIndex]
    }
  },
  ADD_ALBUM: (state, { album }) => {
    for (const song of album.songs) {
      state.songs.push(song)
    }
  },
  ADD_SONG: (state, { song }) => {
    state.songs.push(song)
  },
  REMOVE_SONG: (state, { index }) => {
    if (index !== -1) {
      state.songs.splice(index, 1)
    }
  },
  SELECT_SONG: (state, { index }) => {
    if (index > -1 && index < state.songs.length) {
      state.currentIndex = index
      state.currentSong = state.songs[state.currentIndex]
    }
  },
  SHUFFLE: state => {
    for (let i = state.songs.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      const itemAtIndex = state.songs[randomIndex]
      Vue.set(state.songs, randomIndex, state.songs[i])
      Vue.set(state.songs, i, itemAtIndex)
      if (state.currentSong !== null && itemAtIndex.id === state.currentSong.id) {
        state.currentIndex = i
      }
    }
  },
  PLAYING: (state, { playing }) => {
    state.isPlaying = playing
    state.isPaused = !playing
  },
  SAVE: (state, { title }) => {
    state.name = title
  },
  UPDATE_LIST: (state, { list }) => {
    state.songs = list
  },
  SET_REPEAT_MODE: (state, { mode }) => {
    if (state.repeatModes.includes(mode)) {
      let currentIndex = state.repeatModes.indexOf(mode) + 1
      if (currentIndex >= state.repeatModes.length) {
        currentIndex = 0
      }
      state.repeatMode = state.repeatModes[currentIndex]
    }
  }
}

const getters = {
  getPreloadSong: state => {
    console.log(state.currentIndex)
    if (state.currentIndex !== null) {
      return state.songs[state.currentIndex + 1]
    }
  },
  getCurrentSong: state => maybe(state.currentSong, song => song),
  getCurrentSelectedItem: state => state.currentIndex,
  list: state => state.songs,
  isPlaying: state => state.isPlaying,
  isPaused: state => state.isPaused,
  name: state => state.name,
  repeatModes: state => state.repeatModes,
  repeatMode: state => state.repeatMode
}
const playlist = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default playlist
