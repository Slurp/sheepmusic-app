<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="queue">
        <i class="material-icons">playlist_add</i>
    </a>
</template>
<script>
import Toaster from 'services/toast'

export default {
  name: 'queue-album-btn',
  props: ['album'],
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
      this.$store.dispatch('playlist/queueAlbum', this.album)
      this.toast.toast(`${this.album.name} added to your playlist`)
    }
  }
}
</script>
