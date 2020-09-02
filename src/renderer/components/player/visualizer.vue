<template>
  <canvas
      id="visualizer"
      v-bind:style="{width:this._renderWidth, height:this._renderHeight}"
      ref="canvas"
  />
</template>

<script>
  import canvas from '@/services/visualizer/canvas'
  import visualizerConstants from '@/services/visualizer/contants'
  import octaveBucketsForBufferLength from '@/services/visualizer/ocatave'

export default {
    name: 'visualizer',
    data() {
      return {
        analyser: visualizerConstants.VISUALIZERS.BAR,
        style: 'BAR',
        width: 552,
        height: 32,
        heightMultiplier: 0,
        status: 'STOPPED',
        windowShade: false,
        dummyVizData: {
          0: 11.75,
          8: 11.0625,
          16: 8.5,
          24: 7.3125,
          32: 6.75,
          40: 6.4375,
          48: 6.25,
          56: 5.875,
          64: 5.625,
          72: 5.25,
          80: 5.125,
          88: 4.875,
          96: 4.8125,
          104: 4.375,
          112: 3.625,
          120: 1.5625
        }
      }
    },
    mounted() {
      this.$store.dispatch('player/init').then(() => {
        this.analyser = this.$store.getters['player/getAnalyser']

        this.barPeaks = new Array(visualizerConstants.NUM_BARS).fill(0)
        this.barPeakFrames = new Array(visualizerConstants.NUM_BARS).fill(0)
        this.canvasCtx = this.$refs.canvas.getContext('2d')
        this.canvasCtx.imageSmoothingEnabled = false

        this.setStyle()
        this.loop()
      })
    },
    destroyed() {
      if (this._animationRequest) {
        window.cancelAnimationFrame(this._animationRequest)
      }
    },
    updated() {
      this.setStyle()
      // Redraw the current frame, since the skin may have changed.
      this.paintFrame()
    },
    methods: {
      _renderWidth() {
        return this.width
      },

      _renderHeight() {
        return this.height
      },

      _height() {
        return (this.height * (visualizerConstants.PIXEL_DENSITY / 2))
      },

      _width() {
        return (visualizerConstants.NUM_BARS * (visualizerConstants.PIXEL_DENSITY + 1)) + visualizerConstants.NUM_BARS + 1
      },
      // Kick off the animation loop
      loop() {
        this.canvasCtx.drawImage(this.bgCanvas, 0, 0)
        if (this.dummyVizData) {
          Object.keys(this.dummyVizData).forEach(i => {
            this._printBar(i, this.dummyVizData[i])
          })
          this.dummyVizData = null
        } else if (this.playing) {
          this._paintBarFrame()
        }
        this._animationRequest = window.requestAnimationFrame(this.loop)
      },

      setStyle() {
        // TODO: Split this into to methods. One for skin update, one for style
        // update.
        this.preRenderBg()
        this.preRenderBar()
        this.heightMultiplier = this._renderHeight() / 256
        if (this.style === visualizerConstants.VISUALIZERS.OSCILLOSCOPE) {
          this.bufferLength = this.analyser.fftSize
          this.dataArray = new Uint8Array(this.bufferLength)
        } else if (this.style === visualizerConstants.VISUALIZERS.BAR) {
          this.bufferLength = this.analyser.frequencyBinCount
          this.dataArray = new Uint8Array(this.bufferLength)
          if (!this.octaveBuckets) {
            this.octaveBuckets = octaveBucketsForBufferLength(this.bufferLength)
          }
        }
      },
      // Pre-render the background grid
      preRenderBg() {
        this.bgCanvas = canvas.preRenderBg(
          this._width(),
          this._height(),
          visualizerConstants.colors[0],
        )
      },
      // Pre-render the bar gradient
      preRenderBar() {
        this.barCanvas = canvas.preRenderBar(
          this._height(),
          visualizerConstants.colors,
          this._renderHeight()
        )
      },
      _printBar(x, height, peakHeight) {
        height = Math.ceil(height) * (visualizerConstants.PIXEL_DENSITY / 2)
        peakHeight = Math.ceil(peakHeight) * (visualizerConstants.PIXEL_DENSITY / 2)
        if (height > 0 || peakHeight > 0) {
          const y = this._height() - height
          const ctx = this.canvasCtx
          // Draw the gradient
          const b = visualizerConstants.BAR_WIDTH
          if (height > 0) {
            ctx.drawImage(this.barCanvas, 0, y, b, height, x, y, b, height)
          }

          const peakY = this._height() - peakHeight
          ctx.fillStyle = visualizerConstants.colors[visualizerConstants.PEAK_COLOR_INDEX]
          ctx.fillRect(x, peakY, visualizerConstants.PIXEL_DENSITY, visualizerConstants.PIXEL_DENSITY)
        }
      },

      _paintBarFrame() {
        this.analyser.getByteFrequencyData(this.dataArray)
        const xOffset = visualizerConstants.PIXEL_DENSITY + 1 // Bar width, plus a pixel of spacing to the right.
        for (let j = 0; j < visualizerConstants.NUM_BARS - 1; j++) {
          const start = this.octaveBuckets[j]
          const end = this.octaveBuckets[j + 1]
          let amplitude = 0
          for (let k = start; k < end; k++) {
            amplitude += this.dataArray[k]
          }
          amplitude /= end - start

          // The drop rate should probably be normalized to the rendering FPS, for now assume 60 FPS
          // eslint-disable-next-line no-mixed-operators
          let barPeak = this.barPeaks[j] - visualizerConstants.BAR_PEAK_DROP_RATE * Math.pow(this.barPeakFrames[j], 2)
          if (barPeak < amplitude) {
            barPeak = amplitude
            this.barPeakFrames[j] = 0
          } else {
            this.barPeakFrames[j] += 1
          }
          this.barPeaks[j] = barPeak

          this._printBar(
            j * xOffset,
            amplitude * this.heightMultiplier,
            barPeak * this.heightMultiplier
          )
        }
      }
    },
    computed: {
      playing() {
        return this.$store.getters['playlist/isPlaying']
      }
    }
  }
</script>
