<template>
    <card v-bind:loaded="loadedAlbum"
          v-bind:cover="cover"
          v-bind:detail-link="detailLink"
          v-bind:title="album.name"
          v-bind:subtitle="album.artist.name"
          v-bind:buttons="buttons"
          v-bind:data-object="{album}"/>

</template>

<script>
import Toaster from '@/services/toast'
import config from '@/config/index'
import Card from 'components/list/card'
import playBtn from './play-btn'
import queueBtn from './queue-btn'

export default {
  props: ['album', 'albumId'],
  components: {
    Card,
    playBtn,
    queueBtn
  },
  data() {
    return {
      openSheet: false,
      toast: new Toaster(),
      loaded: false,
      defaultCover: config.defaultCover,
      buttons: [
        { name: 'play', component: playBtn },
        { name: 'queue', component: queueBtn }
      ]
    }
  },
  created() {
    this.getAlbumDetails()
  },
  beforeDestroy() {
    this.toast = null
    delete this.toast
    delete this.openSheet
    delete this.loaded
  },
  methods: {
    getAlbumDetails() {
      if ((this.album && this.album.fullyLoaded) === false) {
        this.$store.dispatch('albums/loadAlbum', this.albumId).then(() => {
          this.loaded = true
        }).catch(() => {
          this.toast.toast(`Stop! ${this.album.name} got hammered and is not getting of the server`)
          this.loaded = false
        })
      } else {
        this.loaded = true
      }
    },
    toggleSheet() {
      this.openSheet = !this.openSheet
    }
  },
  computed: {
    hasCover() {
      return (this.loadedAlbum && this.album.cover)
    },
    cover() {
      if (this.hasCover) {
        return new URL(this.album.cover, config.baseUrl)
      }
      return config.defaultCover
    },
    loadedAlbum() {
      return this.loaded && (this.album && this.album.fullyLoaded)
    },
    detailLink() {
      if (this.loadedAlbum) {
        return {
          name: 'detail_album',
          params: { artist: this.album.artist.name, album: this.album.slug, id: this.album.id }
        }
      }
      return '/'
    }
  }

}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
