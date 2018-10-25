import { addItemsAndSortedList } from '@/store/helpers/mutations'
import { sortedActions, sortedMutations } from '@/store/helpers/sortedPage'
import Vue from 'vue'

const state = {
  genres: [],
  sortedList: [],
  current: null,
  page: 1,
  sortBy: 'all',
  fetchedOverview: false
}

const actions = {
  loadGenres({ commit, state }) {
    if (state.fetchedOverview === false) {
      Vue.axios.get('/api/genre_list').then(response => {
        commit('ADD_GENRES', { genres: response.data })
      }, err => {
        console.log(err)
      })
    }
  },
  loadGenre({ commit, state }, genreId) {
    if (state.genres[genreId] === null || state.genres[genreId].songs === null) {
      Vue.axios.get(`/api/genre/${genreId}`).then(response => {
        commit('ADD_GENRE', { genre: response.data, index: genreId })
      }, err => {
        console.log(err)
      })
    }
  },
  viewGenre({ commit }, genreId) {
    commit('SET_CURRENT_GENRE', { index: genreId })
  },
  ...sortedActions
}

const mutations = {
  ADD_GENRES: (state, { genres }) => {
    state.fetchedOverview = true
    addItemsAndSortedList(state, 'genres', genres, 'fullyLoaded')
  },
  ADD_GENRE: (state, { genre, index }) => {
    genre.fullyLoaded = true
    Vue.set(state.genres, index, genre)
  },
  SET_CURRENT_GENRE: (state, { index }) => {
    state.current = state.genres[index]
  },
  ...sortedMutations
}

const getters = {
  pageNumber: state => state.page,
  totalGenres: state => state.genres.length,
  getByLetter: state => letter => state.genres.filter(genre => (genre.name[0] && genre.name[0].toLowerCase() === letter)),
  getGenreById: state => genreId => state.genres[genreId]
}

const genres = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default genres
