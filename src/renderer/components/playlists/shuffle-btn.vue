<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="playShuffle">
        <i class="material-icons">
            shuffle
        </i>
    </a>
</template>
<script>
  export default {
    name: 'shuffle-playlist-btn',
    props: ['playlist'],
    methods: {
      playShuffle(event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/clearPlaylist')
        this.$store.dispatch('playlist/setTitle', this.playlist.name)
        for (const song of this.playlist.songs) {
          this.$store.dispatch('playlist/queueSong', song)
        }
        this.$store.dispatch('playlist/shuffle')
        this.$store.dispatch('playlist/nextSong')
      }
    }
  }
</script>
