<template>
    <a class="btn btn-float btn-sm btn-secondary" v-on:click.stop.prevent="edit">
       <i class="material-icons">update</i>
    </a>
</template>
<script>
import Toaster from '@/services/toast'
export default {
  name: 'edit-artist-btn',
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
      this.$store.dispatch('artists/updateArtist', this.artist.id)
      this.toast.toast(`${this.artist.name} is going to be updated`)
    }
  }
}
</script>
