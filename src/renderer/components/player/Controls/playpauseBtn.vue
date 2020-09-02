<template>
  <button type='button'
          class="player__button player__button__center"
          v-on:click.stop.prevent="toggle">
    <i class='material-icons' v-if="!isPlaying">play_circle_outline</i>
    <i class='material-icons' v-if="isPlaying">pause_circle_outline</i>
  </button>
</template>
<script>
  export default {
    name: 'playpauseBtn',
    methods: {
      toggle() {
        if (this.isPlaying) {
          this.$store.dispatch('player/pause')
        } else {
          this.$store.dispatch('player/play', { song: this.$store.getters['playlist/getCurrentSong'] })
        }
      }
    },
    computed: {
      isPlaying() {
        return this.$store.getters['player/isPlaying']
      }
    }
  }
</script>
