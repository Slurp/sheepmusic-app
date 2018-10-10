<template>
    <div class="playing-overlay" v-if="show">
        <div class="background-image" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></div>
        <div class="playing-overlay__content">
            <h1>Now playing</h1>
            <div class="album-cover">
                <div class="case">
                    <div class="overlay"></div>
                    <img class="cover"
                         v-lazyload
                         :alt="album.name"
                         :src=cover
                         :data-src=cover
                         :data-err=defaultCover
                    />
                    <div class="slot">
                    </div>
                    <div class="vinyl"><i></i></div>
                </div>
            </div>
            <div class="info">
                <h2 class="artist-name"><img :src="logo" v-if="logo"><span v-else>{{ artist.name }}</span></h2>
                <h3>{{ song.title }}</h3>
                <h4>{{ album.name }}</h4>
                <p class="audio-info">
                   {{song.audio.dataformat }} {{ song.audio.bitrate_mode }} - {{ song.audio.sample_rate }}Hz - {{ song.audio.channelmode }}
                    <i class="material-icons" v-if="song.audio.lossless">hd</i>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import IdleJs from 'idle-js'
import config from '@/config/index'
import { maybe } from '../../services/functional-tools'
import { getBackground, getLogo } from '../../store/modules/artists/model'

export default {
  name: 'player-overlay',
  created() {
    this.watchIdle()
  },
  data() {
    return {
      defaultCover: config.defaultCover
    }
  },
  methods: {
    watchIdle() {
      const idle = new IdleJs({
        idle: 60 * 1000,
        events: ['keydown', 'mousedown', 'touchstart'],
        keepTracking: true,
        startAtIdle: false,
        onIdle: () => {
          this.$store.dispatch('changeIdle', true)
        },
        onActive: () => {
          this.$store.dispatch('changeIdle', false)
        }
      })
      idle.start()
    }
  },
  computed: {
    song() {
      return this.$store.getters['playlist/getCurrentSong']
    },
    cover() {
      if (this.song && this.song.album.cover) {
        return new URL(this.song.album.cover, config.baseUrl)
      }
      return config.defaultCover
    },
    album() {
      if (this.song) {
        this.$store.dispatch('albums/loadAlbum', this.song.album.id)
        return this.$store.getters['albums/getAlbumById'](this.song.album.id)
      }
      return null
    },
    artist() {
      if (this.song) {
        this.$store.dispatch('artists/loadArtist', this.song.artist.id)
        return this.$store.getters['artists/getArtistById'](this.song.artist.id)
      }
      return null
    },
    background() {
      return maybe(this.artist, artist => getBackground(artist))
    },
    logo() {
      return maybe(this.artist, artist => getLogo(artist))
    },
    show() {
      return (this.$store.getters.isIdle && this.$store.getters['playlist/isPlaying'] && this.song)
    }
  }
}
</script>

