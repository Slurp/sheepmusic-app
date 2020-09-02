<template>
  <button type='button'
          class="player__button"
          v-on:click.stop.prevent="next">
    <i class='material-icons'>skip_next</i>
    <span class='plyr__sr-only'>next</span>
  </button>
</template>
<script>
  export default {
    name: 'nextSongBtn',
    methods: {
      next() {
        this.$store.dispatch('player/next')
      }
    }
  }
</script>
