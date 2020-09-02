import BlaatAudio from 'components/BSAudioSuite/BlaatAudio'
import Emitter from 'components/BSAudioSuite/emitter'

export default class BlackSheepPlayer {
  constructor(vue) {
    this.player = null
    this.nextSong = null
    this.currentSong = null
    this.playlist = null
    this.events = []
    this.seek = 0
    this.duration = 0
    this.token = vue.$auth.token()
    this.media = new BlaatAudio()
    this.emitter = new Emitter()
  }

  on(eventName, handler) {
    this.emitter.on(eventName, handler)
  }

  createAudio(src, preload = true) {
    return this.media.loadFromUrl(src, preload)
  }

  handleAudioResourceError() {
    this.stop()
    this.emitter.dispatchEvent('playerror')
  }

  /**
   * Preload a song when needed
   * @param song
   */
  preloadSong(song) {
    if (this.nextSong === null) {
      this.nextSong = { id: song.id, player: this.createAudio(song.src, true) }
    }
  }

  /**
   * Play a song boy!
   * @param song
   */
  playSong(song) {
    this.stop()
    let preloadedSong = false
    // Check for preloaded song
    if (this.nextSong && this.nextSong.id === song.id) {
      this.currentSong = this.nextSong
      this.player = this.nextSong.player
      preloadedSong = true
    } else {
      this.currentSong = song
      this.player = this.createAudio(song.src, false)
    }
    this.nextSong = null
    // Attach events for the player
    this.media.on('loaded', () => {
      this.duration = this.media.duration()
      this.emitter.dispatchEvent('loaded', this.duration)
    })

    this.media.on('play', () => {
      if (preloadedSong) {
        this.duration = this.media.duration()
        this.emitter.dispatchEvent('loaded', this.duration)
      }
      this.emitter.dispatchEvent('play')
    })
    this.media.on('timeupdate', () => {
      this.emitter.dispatchEvent('seekUpdate', this.media.timeElapsed())
    })
    this.media.on('end', () => {
      this.stop()
      this.emitter.dispatchEvent('end', null)
    })
    this.media.on('loaderror', () => this.handleAudioResourceError())
    this.restart()
  }

  /**
   * Groundhog day!
   */
  restart() {
    if (this.media) {
      this.media.seek(0)
      this.media.play(this.currentSong.src)
    }
  }

  /**
   * Slow down
   */
  pause() {
    if (this.media.playing()) {
      this.media.pause()
    }
  }

  /**
   * And we go on.
   */
  resume() {
    this.media.play(this.currentSong.url)
  }

  /**
   * Did you had a kitkat?
   * @returns {boolean}
   */
  isPaused() {
    return (this.player !== null && !this.media.playing())
  }

  /**
   * Don't ... me now.
   */
  stop() {
    if (this.player) {
      this.media.stop()
      this.player = null
      this.currentSong = null
    }
  }

  /**
   *
   */
  forward() {
    if (this.player && this.media.playing()) {
      this.player.seek(Math.min(this.player._duration, this.player.seek() + 5))
    }
  }

  rewind() {
    if (this.player && this.media.playing()) {
      this.player.seek(Math.max(0, this.player.seek() - 5))
    }
  }

  /**
   * @param value
   */
  setSeekPosition(value) {
    if (this.player) {
      this.media.seek(value)
    }
  }

  /**
   * Set the volume level.
   *
   * @param {Number}     volume   0-10
   */
  setVolume(volume) {
    this.media.setVolume(volume / 10)
  }

  getVolume() {
    return (this.media.getVolume() * 10)
  }
}
