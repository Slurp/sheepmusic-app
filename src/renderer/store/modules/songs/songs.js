import Vue from 'vue'

const state = {
  songs: []
}

const actions = {
  async announceSong({ dispatch, commit, state }, song) {
    Vue.axios.get(song.events.now_playing).then(() => {
      dispatch('albums/loadAlbum', song.album.id, { root: true })
      dispatch('artists/loadArtist', song.artist.id, { root: true })
    }, err => {
      console.log(err)
    })
  },
  async playedSong({ dispatch, commit, state }, song) {
    Vue.axios.get(song.events.played).then(() => {
      dispatch('albums/loadAlbum', song.album.id, { root: true })
      dispatch('artists/loadArtist', song.artist.id, { root: true })
      console.log('announced song')
    }, err => {
      console.log(err)
    })
  }
}

const mutations = {
  ADD_SONGALBUM: (state, { songs }) => {
    for (const song of songs) {
      Vue.set(state.songs, song.id, song)
    }
  }
}

const getters = {
  songs: state => state.songs,
  getSongsAlbumById: (state, getters) => albumId => state.songs.filter(song => song.album.id === albumId)
}

const songs = {
  namespaced: true,
  actions,
  state,
  mutations,
  getters
}
export default songs
