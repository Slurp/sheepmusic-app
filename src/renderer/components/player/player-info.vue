<template>
    <div class="player-info">

        <img :src="cover" class='song-image'>
        <div class="now-playing" v-if="currentSong">
            <div class="now-playing__content" >
            <h3 class="title" >{{ currentSong.title }}</h3>
            <p class="meta">
                <router-link class="artist" :to=detailArtist>{{ currentSong.artist.name }}</router-link>
                <span> – </span>
                <router-link class="album" :to=detailAlbum>{{ currentSong.album.name }}</router-link>
            </p>
            </div>
        </div>
    </div>
</template>
<script>
  import config from '@/config/index'

export default {
    name: 'player-info',
    computed: {
      playing() {
        return this.$store.getters['playlist/isPlaying']
      },
      currentSong() {
        if (this.playing) {
          return this.$store.getters['playlist/getCurrentSong']
        }
        return null
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
