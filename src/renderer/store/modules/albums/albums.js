import Vue from 'vue'
import { sortedState, sortedMutations, sortedActions, sortedGetters } from '@/store/helpers/sortedPage'
import { addItemsAndSortedList } from '@/store/helpers/mutations'
import { getImportedByMonth } from '../../helpers/stats'

const state = {
  albums: [],
  currentAlbum: null,
  ...sortedState
}

const actions = {
  async loadAlbums({ commit, state }) {
    return new Promise((resolve, reject) => {
      Vue.axios.get('/api/album_list').then(response => {
        if (response.data.length !== state.albums.length) {
          commit('ADD_ALBUMS', { albums: response.data })
          resolve()
        }
      }, err => {
        reject(err)
      })
    })
  },
  async loadSlice({ commit, state }, albums) {
    return new Promise((resolve, reject) => {
      const collection = albums.filter(album => {
        return !(state.albums[album.id] && state.albums[album.id].fullyLoaded === true)
      })
      if (collection.length > 0) {
        const data = collection.reduce((formData, object) => {
          formData.append('objects[]', object.id)
          return formData
        }, new FormData())
        return Vue.axios.post('/api/album_collection', data).then(response => {
          response.data.forEach(responseAlbum => commit('ADD_ALBUM', {
            album: responseAlbum,
            index: responseAlbum.id
          }))
          resolve(albums)
        }, err => {
          reject(err)
        })
      }
      resolve(albums)
    })
  },
  async loadAlbum({ commit, state }, albumId) {
    if (!state.albums[albumId] || !state.albums[albumId].songs) {
      Vue.axios.get(`/api/album/${albumId}`).then(response => {
        commit('ADD_ALBUM', { album: response.data, index: albumId })
      }, err => {
        console.log(err)
      })
    }
  },
  async getArtwork({ commit, state }, albumId) {
    Vue.axios.get(`/api/album/${albumId}/artwork`).then(response => {
      commit('ADD_ARTWORK', { artwork: response.data, index: albumId })
    }, err => {
      console.log(err)
    })
  },
  async viewAlbum({ commit }, albumId) {
    commit('SET_CURRENT_ALBUM', { index: albumId })
  },
  ...sortedActions
}

const mutations = {
  ADD_ALBUMS: (state, { albums }) => {
    addItemsAndSortedList(state, 'albums', albums, 'songs')
  },
  ADD_ALBUM: (state, { album, index }) => {
    if (state.albums[index] && state.albums[index].fullyLoaded === false) {
      album.fullyLoaded = true
      Vue.set(state.albums, index, album)
    }
  },
  ADD_ARTWORK: (state, { artwork, index }) => {
    if (state.albums[index]) {
      const album = { ...state.albums[index] }
      album.artwork = artwork
      Vue.set(state.albums, index, album)
    }
  },
  SET_CURRENT_ALBUM: (state, { index }) => {
    state.currentAlbum = state.albums[index]
  },
  ...sortedMutations
}

const getters = {
  pageNumber: state => state.page,
  totals: state => state.albums.length,
  slice: state => sortedGetters.getSlice(state, 'albums'),
  getByLetter: state => letter => state.albums.filter(item => (item.name[0] && item.name[0].toLowerCase() === letter)),
  search: state => albums => albums.map(album => state.albums[album.id]),
  getAlbumById: state => albumId => state.albums[albumId],
  detailLink: () => album => ({
    name: 'detail_album',
    params: { artist: album.artist.name, album: album.name, id: album.id }
  }),
  getImportedByMonth: state => {
    return getImportedByMonth(state.albums)
  },
  getLosslessCollection: state => {
    if (state.albums.length > 0) {
      const data = []
      data.push(state.albums.reduce((counter, album) => (album.lossless ? counter + 1 : counter + 0), 0))
      data.push(state.albums.length - data[0])
      return data
    }
    return Array(2).fill(0)
  }
}

const albums = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default albums
