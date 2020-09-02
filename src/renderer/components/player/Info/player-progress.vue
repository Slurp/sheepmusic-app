<template>
  <div class="plyr plyr--audio plyr--ready" v-bind:class="{ 'plyr--playing': playing }">
    <div class="plyr__controls">
      <div class="plyr__progress" v-on:mouseover="hoverProgress = true"
           v-on:mouseout="hoverProgress = false">
        <label for="seek" class="plyr__sr-only">Seek</label>
        <input id="seek" ref="seekerElement" class="plyr__progress--seek" type="range" min="0" max="100"
               step="0.1"
               :value="progress" @mousedown="() => onSeekerMousedown ">
        <progress class="plyr__progress--played" max="100" :value="progress"
                  role="presentation"/>
        <progress class="plyr__progress--buffer" max="100" value="100">
          <span>100</span>
          % buffered
        </progress>
        <span class="plyr__tooltip" v-bind:class="{ 'plyr__tooltip--visible': hoverProgress }"
              v-bind:style="{ left: progress + '%' }">{{ position }}</span>
      </div>
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
      playing() {
        return this.$store.getters['playlist/isPlaying']
      },
      seek() {
        return this.$store.getters['player/getTimeElapsed']
      },
      progress() {
        if (this.mouseDownProgress) {
          return this.variableSeek * 100
        }
        return this.$store.getters['player/getProgress']
      },
      position() {
        return secondsToHis(this.seek)
      },
      changeSeek(e) {
        this.$store.dispatch('player/setSeekPosition', (this.duration / 100 * e.target.value))
      },
      duration() {
        return this.$store.getters['player/duration']
      },
      onSeekerMousedown() {
        if (this.duration > 0) {
          this.mouseDownProgress = true
        }
      },
      onMouseMove(event) {
        if (this.mouseDownProgress === true) {
          this.variableSeek = this.calculatePercentage(event.clientX, this.$refs.seekerElement)
        }
      },
      onMouseUp() {
        if (this.mouseDownProgress === true) {
          this.mouseDownProgress = false
          this.$store.dispatch('player/setSeekPosition', ((this.$refs.seekerElement.value * this.duration) / 100))
        }
      },
      calculatePercentage(xPos, element) {
        return Math.min(1, Math.max(0, (xPos - element.getBoundingClientRect().left) / element.scrollWidth))
      }
    }
  }
</script>
