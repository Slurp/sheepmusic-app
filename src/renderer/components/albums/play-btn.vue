<template>
    <a class="btn btn-float btn-sm btn-secondary waves-attach waves-circle" v-on:click.stop.prevent="play">
        <i class="material-icons">play_arrow</i>
    </a>
</template>
<script>
  export default {
    name: 'play-album-btn',
    props: ['album'],
    methods: {
      play(event) {
        if (event) event.preventDefault()

        this.$store.dispatch('playlist/playAlbum', this.album).then(() => {
          this.$store.dispatch('player/stop')
          this.$store.dispatch('player/play', { song: this.$store.getters['playlist/getCurrentSong'], restart: true })
        })
      }
    }
  }
</script>
