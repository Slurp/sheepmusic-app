<template>
    <div class="player-info">
        <img
            v-lazyload
            :alt="currentSong.title"
            :src=defaultCover
            :data-src=cover
            :data-err=defaultCover
            class="song-image"
        />
        <div class="now-playing" v-if="currentSong">
            <Visualizer class="visualizer"/>
            <div class="now-playing__content" >
                <h3 class="title" >{{ currentSong.title }}</h3>
                <p class="meta">
                    <router-link class="artist" :to=detailArtist>{{ currentSong.artist.name }}</router-link>
                    <router-link class="album" :to=detailAlbum>{{ currentSong.album.name }}</router-link>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
  import config from '@/config/index'
  import Visualizer from '@/components/player/visualizer'

export default {
    name: 'player-info',
    components: {
      Visualizer
    },
    data() {
        return {
            defaultCover: config.defaultCover
        }
    },
    computed: {
      playing() {
        return this.$store.getters['playlist/isPlaying']
      },
      currentSong() {
        return this.$store.getters['playlist/getCurrentSong']
      },
      cover() {
        if (this.currentSong && this.currentSong.album.cover) {
          return new URL(this.currentSong.album.cover, config.baseUrl)
        }
        return config.defaultCover
      },
      detailArtist() {
        if (this.currentSong) {
          return this.$store.getters['artists/detailLink'](this.currentSong.artist)
        }
        return '/'
      },
      detailAlbum() {
        if (this.currentSong) {
          return {
            name: 'detail_album',
            params: { artist: this.currentSong.artist.name, album: this.currentSong.album.name, id: this.currentSong.album.id }
          }
        }
        return '/'
      }
    }
  }
</script>
<style lang="scss" scoped>
    .player-info {
        .now-playing {
            width: 100%;
            height: 100%;
            position: relative;
            padding-top: 20px;
            z-index: 0;
            &__content {
                z-index: 1;
                position: relative;
            }
        }
    }
    .visualizer {
        position: absolute;
        right: 0;
        top: auto;
        bottom: -16px;
        height: 100%;
        width: 100%;
        z-index: 0;
        opacity: 0.5;
        padding-top: 5px;
    }
</style>
