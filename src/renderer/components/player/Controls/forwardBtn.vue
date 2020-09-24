<template>
  <button type='button'
          class="player__button"
          v-on:click.stop.prevent="forward">
    <i class='material-icons'>fast_forward</i>
    <span class='sr-only'>forward</span>
  </button>
</template>
<script>
  export default {
    name: 'forwardBtn',
    methods: {
      forward() {
        this.$store.dispatch('player/forward')
      }
    }
  }
</script>
