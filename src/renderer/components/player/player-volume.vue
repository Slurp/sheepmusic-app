<template>
    <div class="volume">
        <div class="knob-surround">

            <div class="knob" v-bind:style="{ transform: angleTransform }"></div>
            <span class="min">Min</span>
            <span class="max">Max</span>
            <div class="ticks">
                <div v-for="ticker in 19" class="tick" :class="{ 'activetick': ticker <= activeTicks }"></div>
            </div>
            <input type="range" id="volumeRange" :max="max" :step="stepSize" :value="value" @input="updatePosition">
            <label for="volumeRange" class="sr-only">Volume</label>
        </div>
    </div>
</template>
<script>
export default {
  name: 'volume',
  data() {
    return {
      minangle: 0,
      maxangle: 270,
      angle: 0
    }
  },
  props: {
    value: {
      type: Number,
      default: 100
    },
    max: {
      type: Number,
      default: 100
    },
    min: {
      type: Number,
      default: 0
    },
    stepSize: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 70
    }
  },
  mounted() {
    this.angle = (180 / 100 * this.value)
  },
  computed: {
    angleTransform() {
      return `rotate(${this.angle}deg)`
    },
    showValue() {
      return this.value
    },
    activeTicks() {
      return (Math.round(this.angle / 9.5))
    }
  },
  methods: {
    updatePosition(e) {
      this.angle = (180 / 100 * e.target.value)
      this.$emit('input', Number(e.target.value))
    }
  }
}
</script>
