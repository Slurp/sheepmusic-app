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
  paginate({ commit }, page) {
    commit('PAGINATE', { page })
  },
  sortBy({ commit }, sort) {
    commit('SORT_BY', { sort })
  }
}

const mutations = {
  ADD_GENRES: (state, { genres }) => {
    for (const genre of genres) {
      if (!state.genres[genre.id] || state.genres[genre.id].fullyLoaded === false) {
        genre.fullyLoaded = false
        Vue.set(state.genres, genre.id, genre)
      }
    }
    state.fetchedOverview = true
    state.sortedList = state.genres.map(genre => ({
      id: genre.id,
      name: genre.slug,
      date: new Date(genre.createdAt.date)
    }))
    // Remove first value is null
    state.sortedList.splice(0, 1)
    state.sortedList.sort((a, b) => a.name.localeCompare(b.name))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    }
  },
  ADD_GENRE: (state, { genre, index }) => {
    genre.fullyLoaded = true
    Vue.set(state.genres, index, genre)
  },
  SET_CURRENT_GENRE: (state, { index }) => {
    state.current = state.genres[index]
  },
  PAGINATE: (state, { page }) => {
    state.page = page
  },
  SORT_BY: (state, { sort }) => {
    if (sort !== state.sortBy) {
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else {
        state.sortedList.sort((a, b) => a.name.localeCompare(b.name))
      }
      state.sortBy = sort
    }
  }
}

const getters = {
  pageNumber: state => state.page,
  totalGenres: state => state.genres.length,
  getGenresByLetter: state => letter => state.genres.filter(genre => (genre.name[0] && genre.name[0].toLowerCase() === letter)),
  getGenres: state => {
    if (state.genres.length >= 50) {
      const start = (50 * (state.page - 1))
      return state.sortedList.slice(start, start + 50).map(genre => state.genres[genre.id]).filter(Boolean)
    }
    return state.genres
  },
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
