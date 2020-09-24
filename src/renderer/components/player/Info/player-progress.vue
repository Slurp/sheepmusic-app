<template>
  <div class="progress" v-bind:class="{ 'progress--playing': playing }">
    <div class="progress__controls">
      <div class="progress__progress" v-on:mouseover="hoverProgress = true"
           v-on:mouseout="hoverProgress = false">
        <label for="seek" class="sr-only">Seek</label>
        <input id="seek" ref="seekerElement" class="progress__progress--seek" type="range" min="0" max="100"
               step="0.1"
               :value="progress" @mousedown="(event) => this.onSeekerMousedown(event) ">
        <progress class="progress__progress--played" max="100" :value="progress" role="presentation"/>
      </div>
      <span class="progress__tooltip" v-bind:class="{ 'progress__tooltip--visible': hoverProgress }"  v-bind:style="{ left: progress + '%' }">{{ position }}</span>
    </div>
  </div>
</template>
<script>
  import { secondsToHis } from '@/services/time'

  export default {
    name: 'player-progress',
    data() {
      return {
        hoverProgress: false,
        mouseDownProgress: false
      }
    },
    mounted() {
      this.$store.dispatch('playlist/setPlayingStatus', false)
      window.addEventListener('mousemove', this.onMouseMove)
      window.addEventListener('mouseup', this.onMouseUp)
    },
    computed: {
      playing()
      {
        return this.$store.getters['playlist/isPlaying']
      },
      seek()
      {
        return this.$store.getters['player/getTimeElapsed']
      },
      progress()
      {
        if (this.mouseDownProgress) {
          return this.variableSeek * 100
        }
        return this.$store.getters['player/getProgress']
      },
      position()
      {
        return secondsToHis(this.seek)
      },
      duration()
      {
        return this.$store.getters['player/duration']
      },
    },
    methods: {
      changeSeek(e) {
        this.$store.dispatch('player/setSeekPosition', (this.duration / 100 * e.target.value))
      },
      onSeekerMousedown() {
        this.mouseDownProgress = true
      },
      onMouseMove(event) {
        if (this.mouseDownProgress === true) {
          this.variableSeek = Math.min(1, Math.max(0, (event.clientX - this.$refs.seekerElement.getBoundingClientRect().left) / this.$refs.seekerElement.scrollWidth))
        }
      },
      onMouseUp() {
        if (this.mouseDownProgress === true) {
          this.mouseDownProgress = false
          this.$store.dispatch('player/setSeekPosition', ((this.$refs.seekerElement.value * this.duration) / 100))
        }
      },
      calculatePercentage(xPos, element) {

      }
    }
  }
</script>
