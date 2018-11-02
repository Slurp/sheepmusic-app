<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="edit">
        <i class="material-icons">
            playlist_play
        </i>
    </a>
</template>
<script>
import Vue from 'vue'
import Toaster from '@/services/toast'
export default {
  name: 'playlist-artist-btn',
  props: ['artist'],
  data() {
    return {
      toast: new Toaster()
    }
  },
  beforeDestroy() {
    this.toast = null
    delete this.toast
  },
  methods: {
    edit(event) {
      if (event) event.preventDefault()
      this.toast.toast(`Creating new playlist for ${this.artist.name}`)
      Vue.axios.get(`/api/artist/playlist/${this.artist.id}`).then(response => {
        const playlist = response.data
        this.$store.dispatch('playlist/clearPlaylist')
        this.$store.dispatch('playlist/setTitle', playlist.name)
        for (const song of playlist.songs) {
          this.$store.dispatch('playlist/queueSong', song)
        }
        this.$store.dispatch('playlist/nextSong')
      })
    }
  }
}
</script>
