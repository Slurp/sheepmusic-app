<template>
  <canvas
      id="eqGraph"
      ref="canvas"
      v-bind:style="{width:this.GRAPH_WIDTH, height:this.GRAPH_HEIGHT}"
  />
</template>
<script>
  import { equalizerConstants } from '@/services/equalizer/constants'
  import { percentToRange } from '@/services/functional-tools'
  import { clamp } from '@/components/BSAudioSuite/utils'
  import spline from '@/components/player/EqualizerWindow/spline'

  export default {
    name: 'graph',
    data() {
      const preamp = new Image();
      preamp.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHEAAAABCAYAAADpXEERAAAAE0lEQVQoU2Pcdfruf4ZRMKRDAAD1lwNjTqcaUQAAAABJRU5ErkJggg==';
      const graph = new Image();
      graph.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAATCAYAAABRC2cZAAAAR0lEQVQYV2O4rCT9n+F9kOJ/hvfViv8ZHkzSQCE2afxneH/HEJm49Nr0PwOYWPLIAkp0PjL4z1B41uQ/Q9QGnf8MWrPEIAQANWYwvnlToNIAAAAASUVORK5CYII=';
      return {
        GRAPH_HEIGHT: 19,
        GRAPH_WIDTH: 113,
        images: {
          preampLine:
              preamp,
          graphLineColors:
              graph
        }
      }
    },
    mounted() {

      console.log(this.$refs.canvas)
      const canvasCtx = this.$refs.canvas.getContext('2d')
      canvasCtx.imageSmoothingEnabled = false
      const colorPattern = this.useColorPattern(canvasCtx)
      const width = Number(this.$refs.canvas.width)
      const height = Number(this.$refs.canvas.height)
      canvasCtx.clearRect(0, 0, width, height)
      this.drawEqLine(colorPattern, this.sliders, canvasCtx, this.images.preampLine)
    },
    computed: {
      sliders() {
        return this.$store.getters['equalizer/getSliders']
      }
    },
    methods: {
      useColorPattern(canvasCtx) {
        return canvasCtx.createPattern(this.images.graphLineColors, 'repeat-x')
      },
      drawEqLine(colorPattern, sliders, canvasCtx, preampLineImage) {
        const preampValue = percentToRange(sliders.preamp / 100, 0, this.GRAPH_HEIGHT - 1)
        canvasCtx.drawImage(
          preampLineImage,
          0,
          preampValue,
          preampLineImage.width,
          preampLineImage.height
        )

        const amplitudes = equalizerConstants.bands.map(band => sliders[band])

        canvasCtx.fillStyle = colorPattern
        const paddingLeft = 2 // TODO: This should be 1.5

        const min = 0
        const max = this.GRAPH_HEIGHT - 1

        const xs = []
        const ys = []
        amplitudes.forEach((value, i) => {
          const percent = (100 - value) / 100
          // Each band is 12 pixels widex
          xs.push(i * 12)
          ys.push(percentToRange(percent, min, max))
        })

        const allYs = spline(xs, ys)

        const maxX = xs[xs.length - 1]
        let lastY = ys[0]
        for (let x = 0; x <= maxX; x++) {
          const y = clamp(Math.round(allYs[x]), 0, this.GRAPH_HEIGHT - 1)
          const yTop = Math.min(y, lastY)
          const height = 1 + Math.abs(lastY - y)
          canvasCtx.fillRect(paddingLeft + x, yTop, 1, height)
          lastY = y
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
 #eqGraph {
   width: 100%;
   min-height: 50px;
 }
</style>
