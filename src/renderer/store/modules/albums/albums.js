import Vue from 'vue'
import { sortedState, sortedMutations, sortedActions } from 'store/helpers/sortedPage'
import { addItemsAndSortedList } from 'store/helpers/mutations'

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
  async loadAlbumCollection({ commit }, albums) {
    return new Promise((resolve, reject) => {
      const collection = albums.filter(album => (!state.albums[album.id] || state.albums[album.id].fullyLoaded === false))
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
          resolve()
        }, err => {
          reject(err)
        })
      }
      resolve()
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
    album.fullyLoaded = true
    Vue.set(state.albums, index, album)
  },
  SET_CURRENT_ALBUM: (state, { index }) => {
    state.currentAlbum = state.albums[index]
  },
  ...sortedMutations
}

const getters = {
  pageNumber: state => state.page,
  totalAlbums: state => state.albums.length,
  albums: state => {
    if (state.albums.length >= state.itemsPerPage) {
      const start = (state.itemsPerPage * (state.page - 1))
      return state.sortedList.slice(start, start + state.itemsPerPage).map(album => state.albums[album.id])
    }
    return state.albums.slice
  },
  search: state => albums => albums.map(album => state.albums[album.id]),
  getAlbumById: state => albumId => {
    return state.albums[albumId]
  },
  detailLink: state => album => ({
    name: 'detail_album',
    params: { artist: album.artist.name, album: album.name, id: album.id }
  }),
  getImportedByMonth: state => {
    if (state.albums.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.albums.reduce((r, o) => {
        const date = new Date(o.createdAt.date)
        const m = date.getMonth()
        if (year === date.getFullYear()) {
          // eslint-disable-next-line no-unused-expressions
          (r[m]) ? r[m]++ : r[m] = 1
        }
        return r
      }, Array(12).fill(0))
      for (let i = 1; i < 12; i++) {
        groups[i] += groups[i - 1]
      }
      return groups
    }
    return Array(12).fill(0)
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
