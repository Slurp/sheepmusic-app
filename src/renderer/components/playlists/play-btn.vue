<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="play">
        <i class="material-icons">play_arrow</i>
    </a>
</template>
<script>
  export default {
    name: 'play-playlist-btn',
    props: ['playlist'],
    methods: {
      play(event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/clearPlaylist')
        this.$store.dispatch('playlist/setTitle', this.playlist.name)
        for (const song of this.playlist.songs) {
          this.$store.dispatch('playlist/queueSong', song)
        }
        this.$store.dispatch('playlist/nextSong')
      }
    }
  }
</script>
