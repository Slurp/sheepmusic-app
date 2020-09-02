import ElementSource from './source'
import Emitter from './emitter'
import StereoBalanceNode from './StereoBalanceNode'
import { BANDS, MEDIA_STATUS } from './constants'

export default class BlaatAudio {
  constructor() {
    this.emitter = new Emitter()
    this.context = new (window.AudioContext || window.webkitAudioContext)()
    this.contextFix()
    this.createNodes()
    // Create the analyser node for the visualizer
    this.createAnalyser()
    this.createOutput()
    this.source = null
    this.sources = []
    this.currentUrl = null
  }

  createAnalyser() {
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 2048
    // don't smooth audio analysis
    this.analyser.smoothingTimeConstant = 0.0
    console.log(this.analyser)
  }
  contextFix() {
    // Fix for iOS and Chrome (Canary) which require that the context be created
    // or resumed by a user interaction.
    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
    // https://gist.github.com/laziel/7aefabe99ee57b16081c
    // Via: https://stackoverflow.com/a/43395068/1263117
    // TODO #leak
    if (this.context.state === 'suspended') {
      const resume = async () => {
        await this.context.resume()

        if (this.context.state === 'running') {
          // TODO: Add this to the disposable
          document.body.removeEventListener('touchend', resume, false)
          document.body.removeEventListener('click', resume, false)
          document.body.removeEventListener('keydown', resume, false)
        }
      }

      document.body.addEventListener('touchend', resume, false)
      document.body.addEventListener('click', resume, false)
      document.body.addEventListener('keydown', resume, false)
    }
  }

  createNodes() {
    // Create the preamp node
    // TODO: Maybe we can get rid of this now that we are using AudioAbstraction?
    this.staticSource = this.context.createGain() // Just a noop node
    // // Stereo Balancer
    this.balance = new StereoBalanceNode(this.context)
    this.preamp = this.context.createGain()
    // Create the gain node for the volume control
    this.gainNode = this.context.createGain() // Just a noop node
    this.staticSource.connect(this.preamp)
  }

  createSource() {
    const newSource = new ElementSource(this.context, this.staticSource)

    newSource.on('positionChange', () => {
      this.emitter.dispatchEvent('timeupdate')
    })
    newSource.on('ended', () => {
      this.emitter.dispatchEvent('ended')
    })
    newSource.on('statusChange', () => {
      if (newSource.getStatus() === MEDIA_STATUS.PLAYING) {
        this.emitter.dispatchEvent('playing')
      }
      this.emitter.dispatchEvent('durationchange')
    })
    newSource.on('loaded', () => {
      this.emitter.dispatchEvent('loaded')
    })

    return newSource
  }

  createOutput() {
    let output = this.preamp
    this.bands = {}

    BANDS.forEach((band, i) => {
      const filter = this.context.createBiquadFilter()

      this.bands[band] = filter

      if (i === 0) {
        // The first filter, includes all lower frequencies
        filter.type = 'lowshelf'
      } else if (i === BANDS.length - 1) {
        // The last filter, includes all higher frequencies
        filter.type = 'highshelf'
      } else {
        filter.type = 'peaking'
      }
      filter.frequency.value = band
      filter.gain.value = 0

      output.connect(filter)
      output = filter
    })

    output.connect(this.balance)
    // //
    this.balance.connect(this.gainNode)
    this.balance.connect(this.analyser)

    this.gainNode.connect(this.context.destination)
  }

  playing() {
    return (this.source !== null && this.source.getStatus() === MEDIA_STATUS.PLAYING)
  }

  getStatus() {
    if(this.source !== null) {
      return this.source.getStatus()
    }
    return MEDIA_STATUS.STOPPED
  }

  getAnalyser() {
    console.log(this.analyser)
    return this.analyser
  }

  /* Properties */
  duration() {
    return this.source.getDuration()
  }

  timeElapsed() {
    return this.source.getTimeElapsed()
  }

  timeRemaining() {
    return this.duration() - this.timeElapsed()
  }

  percentComplete() {
    return (this.timeElapsed() / this.duration()) * 100
  }

  /* Actions */
  async play(url) {
    if (url && url !== this.currentUrl) {
      this.currentUrl = url
    }
    this.source = this.sources[this.currentUrl]
    await this.source.play()
  }

  pause() {
    if (this.source) {
      this.source.pause()
    }
  }

  stop() {
    if (this.source) {
      this.source.stop()
    }
  }

  /* Actions with arguments */
  seekToPercentComplete(percent) {
    const seekTime = this.duration() * (percent / 100)
    this.seek(seekTime)
  }

  // From 0-1
  setVolume(volume) {
    this.gainNode.gain.value = volume
  }

  // From 0-1
  getVolume() {
    return this.gainNode.gain.value
  }

  // from 0 to 100
  // The input value here is 0-100 which is kinda wrong, since it represents -12db to 12db.
  // For now, 50 is 0db (no change).
  // Equation used is: 10^((dB)/20) = x, where x (preamp.gain.value) is passed on to gainnode for boosting or attenuation.
  setPreamp(value) {
    // eslint-disable-next-line no-mixed-operators
    const db = (value / 100) * 24 - 12
    this.preamp.gain.value = Math.pow(10, db / 20)
  }

  // From -100 to 100
  setBalance(balance) {
    this.balance.balance.value = balance / 100
  }

  setEqBand(band, value) {
    console.log(this.bands)
    console.log(this.bands[Number.parseInt(band, 10)])
    this.bands[Number.parseInt(band, 10)].gain.value = value // ((value / 100) * 24) - 12
  }

  disableEq() {
    this.staticSource.disconnect()
    this.staticSource.connect(this.balance)
  }

  enableEq() {
    this.staticSource.disconnect()
    this.staticSource.connect(this.preamp)
  }

  /* Listeners */
  on(event, callback) {
    this.emitter.on(event, callback)
  }

  seek(time) {
    this.source.seekToTime(time)
  }

  // Used only for the initial load, since it must have a CORS header
  async loadFromUrl(url, preload = true) {
    this.emitter.dispatchEvent('waiting')
    if (!this.sources[url]) {
      this.sources[url] = this.createSource()
      this.sources[url].loadUrl(url).then(() => {
        if (preload === false) {
          this.emitter.dispatchEvent('autoPlay')
          this.emitter.dispatchEvent('play')
          this.play(url)
        }
      })
    }
    if (preload === false) {
      this.emitter.dispatchEvent('autoPlay')
      this.emitter.dispatchEvent('play')
      this.play(url)
    }
  }

  dispose() {
    this.source.dispose()
    this.emitter.dispose()
  }
}
