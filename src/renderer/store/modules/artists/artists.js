import Vue from 'vue'
import config from '@/config/index'
import { sortedState, sortedMutations, sortedActions, sortedGetters, sortingType } from '@/store/helpers/sortedPage'
import { addItemsAndSortedList } from '@/store/helpers/mutations'
import { getBackground, getCover, getLogo } from './model'
import { getImportedByMonth, getUpdatedByMonth } from '@/store/helpers/stats'

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
  async loadSlice({ commit }, artists) {
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
    if (state.artists[artistId] && state.artists[artistId].fullyLoaded === false) {
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
  totals: state => state.artists.length,
  slice: state => sortedGetters.getSlice(state, 'artists'),
  getByLetter: state => letter => state.artists.filter(item => (item.name[0] && item.name[0].toLowerCase() === letter)).sort(sortingType.name),
  getArtistById: state => artistId => {
    if (state.artists) {
      return state.artists[artistId]
    }
  },
  getCover: state => artistId => {
    if (state.artists && state.artists[artistId]) {
      return getCover(state.artists[artistId])
    }
    return config.defaultCover
  },
  getLogoForArtist: state => artistId => {
    if (state.artists && state.artists[artistId]) {
      return getLogo(state.artists[artistId])
    }
    return null
  },
  getBackgroundForArtist: state => artistId => {
    if (state.artists && state.artists[artistId]) {
      return getBackground(state.artists[artistId])
    }
    return null
  },
  search: state => artists => artists.map(artist => state.artists[artist.id]),
  detailLink: state => artist => ({
    name: 'detail_artist',
    params: { artist: artist.name, id: artist.id }
  }),
  getImportedByMonth: state => {
    return getImportedByMonth(state.artists)
  },
  getUpdatedByMonth: state => {
    return getUpdatedByMonth(state.artists)
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
