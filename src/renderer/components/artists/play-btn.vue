<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="play">
        <i class="material-icons">play_arrow</i>
    </a>
</template>
<script>
  export default {
    name: 'play-artist-btn',
    props: ['artist'],
    methods: {
      play(event) {
        if (event) event.preventDefault()
        this.$store.dispatch('playlist/clearPlaylist')
        this.$store.dispatch('albums/loadSlice', this.artist.albums).then(() => {
          for (const album of this.artist.albums) {
            this.$store.dispatch('playlist/queueAlbum', this.$store.getters['albums/getAlbumById'](album.id))
          }
          this.$store.dispatch('playlist/nextSong')
        })
      }
    }
  }
</script>
