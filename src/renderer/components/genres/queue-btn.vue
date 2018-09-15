<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="queue">
        <i class="material-icons">playlist_add</i>
    </a>
</template>
<script>
  export default {
    name: 'queue-artist-btn',
    props: ['playlist'],
    methods: {
      queue(event) {
        if (event) event.preventDefault()
        for (const song of this.playlist.songs) {
          this.$store.dispatch('playlist/queueSong', song)
        }
      }
    }
  }
</script>
