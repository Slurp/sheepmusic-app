<template>
    <card v-bind:loaded="loadedArtist"
          v-bind:cover="cover"
          v-bind:detail-link="detailLink"
          v-bind:title="artist.name"
          v-bind:subtitle="{ text:artist.albums.length, icon:'album' }"
          v-bind:buttons="buttons"
          v-bind:data-object="{artist}" />
</template>

<script>

import Toaster from '@/services/toast'
import config from '@/config/index'
import Card from 'components/list/card'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { maybe } from '../../services/functional-tools'
import { getCover } from '../../store/modules/artists/model'

export default {
  name: 'artistList',
  props: ['artist', 'artistId'],
  components: {
    playBtn,
    queueBtn,
    Card
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
    if (!this.artist || (this.artist && this.artist.fullyLoaded === false)) {
      this.$store.dispatch('artists/loadArtist', this.artistId).then(() => {
        this.loaded = true
      }).catch(() => {
        this.toast.toast('Nope, API SAYS NO.')
        this.loaded = false
      })
    } else {
      this.loaded = true
    }
  },
  beforeDestroy() {
    this.toast = null
    delete this.toast
  },
  methods: {
    toggleSheet(event) {
      if (event) event.preventDefault()
      this.openSheet = !this.openSheet
    }
  },
  computed: {
    cover() {
      return maybe(this.artist, artist => getCover(artist))
    },
    loadedArtist() {
      return (this.loaded && (this.artist && this.artist.fullyLoaded))
    },
    detailLink() {
      if (this.loadedArtist) {
        return this.$store.getters['artists/detailLink'](this.artist)
      }
      return '404'
    }
  }

}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
