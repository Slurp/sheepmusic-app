import Notifications from '@/services/notifications'
import BlaatAudio from 'components/BSAudioSuite/BlaatAudio'
import { MEDIA_STATUS } from 'components/BSAudioSuite/constants'
import Emitter from 'components/BSAudioSuite/emitter'

const state = {
  nextSong: null,
  currentSong: null,
  preloadedSong: false,
  seek: 0,
  duration: 0,
  progress: 0,
  volume: 10,
  token: null,
  media: null,
  emitter: null
}

const attachEvents = ({ state, commit, rootGetters, dispatch }) => {
  // Attach events for the player
  state.media.on('loaded', () => {
    commit('PRELOAD_SONG', rootGetters['playlist/getPreloadSong'])
  })

  state.media.on('play', () => {
    commit('UPDATE_DURATION')
    dispatch('songs/announceSong', state.currentSong, { root: true })
    if (state.preloadedSong === false) {
      commit('PRELOAD_SONG', rootGetters['playlist/getPreloadSong'])
    }
  })
  state.media.on('timeupdate', () => {
    commit('UPDATE_SEEK')
    commit('UPDATE_PROGRESS')
  })
  state.media.on('durationchange', () => {
    commit('UPDATE_DURATION')
  })
  state.media.on('ended', () => {
    dispatch('stop')
    dispatch('songs/playedSong', state.currentSong, { root: true })
    dispatch('next')
  })
  state.media.on('loaderror', () => this.handleAudioResourceError())
}

const actions = {
  init(context) {
    if (state.media === null) {
      context.commit('INIT')
      attachEvents(context)
    }
  },
  play(context, { song, restart = false}) {
    const { commit, state } = context
    if (restart === false && state.media.getStatus() === MEDIA_STATUS.PAUSED) {
      commit('RESUME')
    } else {
      // Check for preloaded song
      if (restart === false && state.nextSong && state.nextSong.id === song.id) {
        commit('SET_CURRENT_SONG', state.nextSong)
        commit('CLEAR_NEXT_SONG')
      } else {
        commit('SET_CURRENT_SONG', song)
      }
      commit('STOP')
      commit('LOAD_SONG', false)
      commit('RESTART')
    }
    context.dispatch('playlist/setPlayingStatus', true, { root: true })
    Notifications.notifySong(context.state.currentSong)
  },
  stop({ commit, dispatch }) {
    commit('STOP')
    dispatch('playlist/setPlayingStatus', false, { root: true })
  },
  pause({ commit, dispatch }) {
    commit('PAUSE')
    dispatch('playlist/setPlayingStatus', false, { root: true })
  },
  resume({ commit }) {
    commit('RESUME')
  },
  forward({ commit }) {
    commit('FORWARD')
  },
  rewind({ commit }) {
    commit('REWIND')
  },
  next({ dispatch, rootGetters }) {
    dispatch('stop')
    if (rootGetters['playlist/repeatMode'] === 'REPEAT_ONE') {
      dispatch('play')
    }
    dispatch('playlist/nextSong', {}, { root: true })
    dispatch('play', { song: rootGetters['playlist/getCurrentSong'], restart: true })
  },
  prev({ dispatch, rootGetters }) {
    dispatch('stop')
    if (rootGetters['playlist/repeatMode'] === 'REPEAT_ONE') {
      dispatch('play')
    }
    dispatch('playlist/prevSong', {}, { root: true })
    dispatch('play', { song: rootGetters['playlist/getCurrentSong'], restart: true })
  },

  /**
   * @param commit
   * @param value
   */
  setSeekPosition({ commit }, value) {
    commit('SEEK', value)
  },

  /**
   * Set the volume level.
   *
   * @param commit
   * @param {Number}     volume   0-100
   */
  setVolume({ commit }, volume) {
    commit('SET_VOLUME', volume)
  },
  setBandValue({ commit }, band, value) {
    commit('SET_BAND', band, value)
  }
}

const mutations = {
  INIT: state => {
    state.media = new BlaatAudio()
    state.emitter = new Emitter()
  },
  LOAD_SONG: (state, song, preload) => {
    state.media.loadFromUrl(state.currentSong.src, preload)
  },
  PRELOAD_SONG: (state, song) => {
    // grab next song.
    if (song !== undefined && !state.nextSong || (state.nextSong.id !== song.id && !state.preloadedSong)) {
      state.nextSong = song
      state.preloadedSong = false
      state.media.loadFromUrl(song.src, true).then(() => {
        state.preloadedSong = true
      })
    }
  },
  SET_CURRENT_SONG: (state, song) => {
    state.currentSong = song
  },
  CLEAR_NEXT_SONG: state => {
    state.nextSong = null
  },

  RESTART: state => {
    if (state.media) {
      state.media.play(state.currentSong.src).then(() => {
        state.media.seek(0)
      })
    }
  },
  STOP: state => {
    if (state.media) {
      state.media.stop()
    }
  },
  PAUSE: state => {
    if (state.media.playing()) {
      state.media.pause()
    }
  },
  RESUME: state => {
    state.media.play(state.currentSong.url)
  },
  FORWARD: state => {
    if (state.media && state.media.playing()) {
      state.media.seek(Math.min(state.media._duration, state.media.seek() + 5))
    }
  },
  REWIND: state => {
    if (state.media && state.media.playing()) {
      state.media.seek(Math.max(0, state.media.seek() - 5))
    }
  },
  UPDATE_DURATION: state => {
    if (state.media) {
      state.duration = state.media.duration()
    }
  },
  UPDATE_SEEK: state => {
    if (state.media) {
      state.seek = state.media.timeElapsed()
      state.progress = state.media.percentComplete()
    }
  },
  UPDATE_PROGRESS: state => {
    if (state.media) {
      state.progress = state.media.percentComplete()
    }
  },
  SEEK: (state, value) => {
    if (state.media) {
      state.media.seek(value)
    }
  },
  SET_VOLUME: (state, { volume }) => {
    if (state.media) {
      state.volume = volume
      state.media.setVolume(parseFloat(volume / 10.0))
    }
  },
  SET_BAND: (state, { band, value }) => {
    if (state.media) {
      if (band === 'preamp') {
        state.media.setPreamp(value)
      } else {
        state.media.setEqBand(band, value)
      }
    }
  }
}

const getters = {
  getAnalyser: state => {
    if (state.media) {
      return state.media.getAnalyser()
    }
  },
  getVolume: state => {
    return state.volume
  },
  isPlaying: state => {
    return (state.media !== null && state.media.playing())
  },
  /**
   * Did you had a kitkat?
   * @returns {boolean}
   */
  isPaused: state => {
    return (state.media !== null && !state.media.playing())
  },
  duration: state => {
    return state.duration
  },
  getTimeElapsed: state => {
    return state.seek
  },
  getProgress: state => {
    return state.progress
  }
}
const player = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default player
