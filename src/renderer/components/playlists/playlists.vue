<template>
    <card v-bind:loaded="loadedPlaylist"
          v-bind:cover="cover"
          v-bind:detail-link="detailLink"
          v-bind:title="playlist.name"
          v-bind:subtitle="{ text:playlistDuration, icon:'av_timer' }"
          v-bind:buttons="buttons"
          v-bind:data-object="{playlist}" />
</template>

<script>
import config from '@/config/index'
import Card from 'components/list/card'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { secondsToHis } from '@/services/time'

export default {
  name: 'playlistList',
  props: ['playlist', 'playlistId'],
  components: {
    playBtn,
    queueBtn,
    Card
  },
  data() {
    return {
      openSheet: false,
      loaded: false,
      defaultCover: config.defaultCover,
      buttons: [
        { name: 'play', component: playBtn },
        { name: 'queue', component: queueBtn }
      ]
    }
  },
  created() {
    if (this.loaded === false || !this.playlist || (this.playlist && !this.playlist.songs)) {
      console.log('load playlist')
      this.loaded = true
      this.$store.dispatch('playlists/loadPlaylist', this.playlistId).then(() => {
        console.log('loaded playlist')
      }).catch(() => {
        this.loaded = false
      })
    }
  },
  methods: {
    toggleSheet() {
      this.openSheet = !this.openSheet
    }
  },
  computed: {
    hasCover() {
      return (this.loaded && (this.playlist.cover))
    },
    cover() {
      if (this.hasCover) {
        return `${config.baseUrl}/${this.playlist.cover}`
      }
      return config.defaultCover
    },
    loadedPlaylist() {
      return (this.loaded && this.playlist && this.playlist.songs)
    },
    detailLink() {
      return {
        name: 'detail_playlists',
        params: { id: this.playlistId }
      }
    },
    playlistDuration() {
      if (this.loaded && this.playlist && this.playlist.songs) {
        return secondsToHis(this.playlist.songs.map(song => (song ? song.length : 0)).reduce((acc, val) => parseInt(acc, 10) + parseInt(val, 10), 0))
      }
      return ''
    }
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
