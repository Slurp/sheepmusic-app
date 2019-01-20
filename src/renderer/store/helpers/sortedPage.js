import { set } from '@/store/helpers/mutations'

export const sortingType = {
  all: (a, b) => a.id - b.id,
  name: (a, b) => a.name.localeCompare(b.name),
  recent: (a, b) => b.date - a.date,
  'most-played': (a, b) => b.playCount - a.playCount,
  random: () => Math.random() - Math.random()
}
export const sortedState = {
  sortedList: [],
  page: 1,
  sortBy: 'all',
  itemsPerPage: 24
}

export const sortedActions = {
  async paginate({ commit }, page) {
    commit('PAGINATE', page)
  },
  async sortBy({ commit }, sortBy) {
    commit('SORT_BY', sortBy)
  }
}

export const sortedMutations = {
  PAGINATE: set('page'),
  SORT_BY: (state, sortBy) => {
    if (sortBy !== state.sortBy) {
      state.sortBy = sortBy
      state.page = 1
      if (sortBy in sortingType) {
        state.sortedList.sort(sortingType[sortBy])
        return
      }
      state.sortedList.sort(sortingType.all)
    }
  }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]]
//   }
//   return a
// }

export const sortedGetters = {
  getSlice: (state, key) => {
    if (state[key].length > 0) {
      if (state[key].length >= state.itemsPerPage) {
        const start = (state.itemsPerPage * (state.page - 1))
        return state.sortedList.slice(start, start + state.itemsPerPage).map(object => state[key][object.id])
      }
      return state.sortedList.map(object => state[key][object.id])
    }
    return null
  }
}
