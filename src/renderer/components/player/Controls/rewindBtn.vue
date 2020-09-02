<template>
  <button type='button'
          class="player__button"
          v-on:click.stop.prevent="rewind">
    <i class='material-icons'>fast_rewind</i>
    <span class='plyr__sr-only'>rewind</span>
  </button>
</template>
<script>
  export default {
    name: 'rewindBtn',
    methods: {
      rewind() {
        this.$store.dispatch('player/rewind')
      }
    }
  }
</script>
