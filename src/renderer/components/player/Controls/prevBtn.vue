<template>
  <button type='button' class="player__button" v-on:click.stop.prevent="prev">
    <i class='material-icons'>skip_previous</i>
    <span class='sr-only'>prev</span>
  </button>
</template>
<script>
  export default {
    name: 'prevSongBtn',
    methods: {
      prev() {
        this.$store.dispatch('player/prev')
      }
    }
  }
</script>
