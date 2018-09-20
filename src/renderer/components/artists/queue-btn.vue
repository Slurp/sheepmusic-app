<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="queue">
        <i class="material-icons">playlist_add</i>
    </a>
</template>
<script>
import Toaster from '@/services/toast'
export default {
  name: 'queue-artist-btn',
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
    queue(event) {
      if (event) event.preventDefault()
      for (const album of this.artist.albums) {
        this.$store.dispatch('playlist/queueAlbum', this.$store.getters['albums/getAlbumById'](album.id))
        this.toast.toast(`${album.name} added to your playlist`)
      }
    }
  }
}
</script>
