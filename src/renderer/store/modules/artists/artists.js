import Vue from 'vue'
import { sortedState, sortedMutations, sortedActions } from 'store/helpers/sortedPage'

import { addItemsAndSortedList } from 'root/store/helpers/mutations'

const state = {
  artists: [],
  currentArtist: null,
  ...sortedState
}

const actions = {
  loadArtists({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.axios.get('/api/artist_list').then(response => {
        commit('ADD_ARTISTS', { artists: response.data })
        resolve()
      }, err => {
        reject(err)
        console.log(err)
      })
    })
  },
  async loadArtistCollection({ commit }, artists) {
    return new Promise((resolve, reject) => {
      const collection = artists.filter(artist => (!state.artists[artist.id] || state.artists[artist.id].fullyLoaded === false))
      if (collection.length > 0) {
        const data = collection.reduce((formData, object) => {
          formData.append('objects[]', object.id)
          return formData
        }, new FormData())
        return Vue.axios.post('/api/artist_collection', data).then(response => {
          response.data.forEach(artistData => commit('ADD_ARTIST', {
            artist: artistData,
            index: artistData.id
          }))
          resolve()
        }, err => {
          reject(err)
        })
      }
      resolve()
    })
  },
  loadArtist({ commit, state }, artistId) {
    if (!state.artists[artistId] || state.artists[artistId].fullyLoaded === false) {
      Vue.axios.get(`/api/artist/${artistId}`).then(response => {
        commit('ADD_ARTIST', { artist: response.data, index: artistId })
      }, err => {
        console.log(err)
      })
    }
  },
  updateArtist({ commit, state }, artistId) {
    Vue.axios.get(`/api/artist/update/${artistId}`).then(response => {
      commit('ADD_ARTIST', { artist: response.data, index: artistId })
    }, err => {
      console.log(err)
    })
  },
  viewArtist({ commit }, artistId) {
    commit('SET_CURRENT_ARTIST', { index: artistId })
  },
  ...sortedActions
}

const mutations = {
  ADD_ARTISTS: (state, { artists }) => {
    addItemsAndSortedList(state, 'artists', artists, 'albums')
  },
  ADD_ARTIST: (state, { artist, index }) => {
    artist.fullyLoaded = true
    Vue.set(state.artists, index, artist)
  },
  SET_CURRENT_ARTIST: (state, { index }) => {
    state.currentArtist = state.artists[index]
  },
  ...sortedMutations
}

const getters = {
  pageNumber: state => state.page,
  totalArtists: state => state.artists.length,
  artists: state => {
    if (state.artists.length >= state.itemsPerPage) {
      const start = (state.itemsPerPage * (state.page - 1))
      return state.sortedList.slice(start, start + state.itemsPerPage).map(artist => state.artists[artist.id])
    }
    return state.artists.slice
  },
  getArtistById: state => artistId => {
    if (state.artists) {
      return state.artists[artistId]
    }
  },
  getLogoForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].logo !== 'undefined' && state.artists[artistId].logo.length > 0) {
      return state.artists[artistId].logo[Math.max(Math.floor(Math.random() * state.artists[artistId].logo.length), state.artists[artistId].logo.length - 1)]
    }
    return null
  },
  getBackgroundForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].background !== 'undefined' && state.artists[artistId].background.length > 0) {
      return state.artists[artistId].background[Math.max(Math.floor(Math.random() * state.artists[artistId].background.length), state.artists[artistId].background.length - 1)]
    }
    return null
  },
  getBannerForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].banner !== 'undefined' && state.artists[artistId].banner.length > 0) {
      return state.artists[artistId].banner[Math.max(Math.floor(Math.random() * state.artists[artistId].banner.length), state.artists[artistId].banner.length - 1)]
    }
    return null
  },
  getThumbForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].thumbs !== 'undefined' && state.artists[artistId].thumbs.length > 0) {
      return state.artists[artistId].thumbs[Math.max(Math.floor(Math.random() * state.artists[artistId].thumbs.length), state.artists[artistId].thumbs.length - 1)]
    }
    return null
  },
  search: state => artists => artists.map(artist => state.artists[artist.id]),
  detailLink: state => artist => ({
    name: 'detail_artist',
    params: { artist: artist.name, id: artist.id }
  }),
  getImportedByMonth: state => {
    if (state.artists && state.artists.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.artists.reduce((r, o) => {
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
  getUpdatedByMonth: state => {
    if (state.artists && state.artists.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.artists.reduce((r, o) => {
        const date = new Date(o.updatedAt.date)
        const m = date.getMonth()
        if (year === date.getFullYear()) {
          if (r[m] === null) {
            r[m] = 1
          } else {
            r[m]++
          }
        }
        return r
      }, Array(12).fill(0))
      return groups
    }
    return Array(12).fill(0)
  }
}

const artists = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default artists
