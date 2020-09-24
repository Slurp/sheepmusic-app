<template>
  <button class="player__button" type='button' data-plyr='mute'>
    <i class='material-icons icon--muted' v-if="muted">volume_off</i>
    <i class='material-icons' v-else>volume_mute</i>
    <span class='sr-only'>Toggle Mute</span>
  </button>
</template>
<script>
  export default {
    name: 'muteBtn',
    data() {
      return {
        muted: false,
        volume: 100
      }
    },
    mounted() {
      this.volume = this.$store.getters['player/getVolume']
      if (this.volume === 0) { // if saved state is 0, make sure we can unmute
        this.volume = 100
        this.muted = true
      }
    },
    methods: {
      mute() {
        this.muted = true
        this.volume = this.$store.getters['player/getVolume']
        this.$store.dispatch('player/setVolume', { volume: 0 })
      },
      /**
       * Unmute the volume.
       */
      unmute() {
        this.muted = false
        this.$store.dispatch('player/setVolume', { volume: this.volume })
      }
    }
  }
</script>
