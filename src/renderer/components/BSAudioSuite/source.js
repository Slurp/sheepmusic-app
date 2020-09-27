import Emitter from './emitter'
import { clamp } from './utils'
import { MEDIA_STATUS } from './constants'

export default class ElementSource {
  on(eventType, cb) {
    return this.emitter.on(eventType, cb)
  }

  constructor(context, destination) {
    this.emitter = new Emitter()
    this.context = context
    this.destination = destination
    this.audio = new Audio()
    this.audio.crossOrigin = 'anonymous'
    this.stalled = false
    this.status = MEDIA_STATUS.STOPPED

    // TODO: #leak
    this.audio.addEventListener('suspend', () => {
      this.setStalled(true)
    })

    // TODO: #leak
    this.audio.addEventListener('durationchange', () => {
      this.emitter.dispatchEvent('durationchange', 'durationchange')
      this.setStalled(false)
    })

    // TODO: #leak
    this.audio.addEventListener('ended', () => {
      this.emitter.dispatchEvent('ended')
      this.setStatus(MEDIA_STATUS.STOPPED)
    })

    // TODO: Throttle to 50 (if needed)
    // TODO: #leak
    this.audio.addEventListener('timeupdate', () => {
      this.emitter.dispatchEvent('positionChange')
    })
    this.audio.addEventListener('loadeddata', () => {
      if (this.audio.readyState >= 2) {
        this.emitter.dispatchEvent('loaded')
      }
    })
    // TODO: #leak
    this.audio.addEventListener('error', e => {
      switch (this.audio.error.code) {
        case 1:
          // The fetching of the associated resource was aborted by the user's request.
          console.error('MEDIA_ERR_ABORTED', e)
          break
        case 2:
          console.error('MEDIA_ERR_NETWORK', e)
          // Some kind of network error occurred which prevented the media from being successfully fetched, despite having previously been available.
          break
        case 3:
          // Despite having previously been determined to be usable, an error occurred while trying to decode the media resource, resulting in an error.

          // There is a bug in Chrome where improperly terminated mp3s can cuase this error.
          // https://bugs.chromium.org/p/chromium/issues/detail?id=794782
          // Related: Commit f44e826c83c74fef04c2c448af30cfb353b28312
          console.error('PIPELINE_ERROR_DECODE', e)
          break
        case 4:
          console.error('MEDIA_ERR_SRC_NOT_SUPPORTED', e)
          // The associated resource or media provider object (such as a MediaStream) has been found to be unsuitable.
          break
        default:
          // Rather than just geting stuck in this error state, we can just pretend this is
          // the end of the track.
          this.emitter.dispatchEvent('ended')
          this.setStatus(MEDIA_STATUS.STOPPED)
      }
    })

    this.source = this.context.createMediaElementSource(this.audio)
    this.source.connect(destination)
  }

  setStalled(stalled) {
    this.stalled = stalled
    this.emitter.dispatchEvent('stallChanged')
  }

  disconnect() {
    this.source.disconnect()
  }

  // Async for now, for compatibility with BufferAudioSource
  // TODO: This does not need to be async
  async loadUrl(url) {
    this.audio.src = url
  }

  async play() {
    if (this.status !== MEDIA_STATUS.PAUSED) {
      this.seekToTime(0)
    }
    try {
      await this.audio.play()
    } catch (err) {
      //
    }
    this.setStatus(MEDIA_STATUS.PLAYING)
  }

  pause() {
    this.audio.pause()
    this.setStatus(MEDIA_STATUS.PAUSED)
  }

  stop() {
    this.audio.pause()
    this.audio.currentTime = 0
    this.setStatus(MEDIA_STATUS.STOPPED)
  }

  seekToTime(time) {
    this.audio.currentTime = clamp(time, 0, this.getDuration())
    this.emitter.dispatchEvent('positionChange')
  }

  getStalled() {
    return this.stalled
  }

  getStatus() {
    return this.status
  }

  getDuration() {
    const { duration } = this.audio
    // Safari on iOS currently has a strange behavior where it reports
    // the duration as infinity if an Accept-Ranges header is not returned.
    // For now, 0 is better even though it's still wrong.
    return isNaN(duration) || duration === Infinity ? 0 : duration
  }

  getTimeElapsed() {
    return this.audio.currentTime
  }

  setStatus(status) {
    this.status = status
    this.emitter.dispatchEvent('statusChange')
  }

  dispose() {
    // TODO: Dispose subscriptions to this.audio
    this.stop()
    this.emitter.dispose()
  }
}
