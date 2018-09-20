<template>
    <div class="song-list">
        <div class="song-list-header">
            <div class="col col-track">#</div>
            <div class="col col-artist" v-if="displayArtist">Artist</div>
            <div class="col col-album" v-if="displayArtist">Album</div>
            <div class="col col-title">Title</div>
            <div class="col col-duration"><i class="material-icons">av_timer</i></div>
            <div class="col col-playcount"><i class="material-icons">music_note</i></div>
            <div class="col col-queue"><i class="material-icons">settings</i></div>
        </div>
        <div class="song-list-item" v-for="song in songs" v-bind:class="{ playing: isActive(song.id) }">
            <div class="col col-track action">
                <span class="track-number" v-if="song.position">
                    {{ song.position }}
                </span>
                <span class="track-number" v-else>
                    {{ song.track }}
                </span>
                <a v-on:click.stop.prevent="play(song)">
                    <i class="material-icons">play_arrow</i>
                </a>
            </div>
            <div class="col col-artist" v-if="displayArtist">
                <router-link class="artist" :to=detailArtist(song)>{{ song.artist.name }}</router-link>
            </div>
            <div class="col col-album" v-if="displayArtist">
                <router-link class="album" :to=detailAlbum(song)>{{ song.album.name }}</router-link>
            </div>
            <div class="col col-title">{{ song.title }}</div>
            <div class="col col-duration">{{ formatLength(song.length) }}</div>
            <div class="col col-playcount">{{ song.playCount }}</div>
            <div class="col col-queue">
                <a v-on:click.stop.prevent="queue(song)">
                    <i class="material-icons">add_to_queue</i>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
  import { secondsToHis } from '@/services/time'
  import Toaster from '@/services/toast'

  export default {
    props: {
      songs: {
        type: Array,
        required: true
      },
      showArtist: {
        required: false
      }
    },
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
      play(song) {
        this.$store.dispatch('playlist/playSong', song)
      },
      queue(song) {
        this.$store.dispatch('playlist/queueSong', song)
        this.toast.toast(`${song.title} added to your playlist`)
      },
      formatLength(length) {
        return secondsToHis(length)
      },
      isActive(id) {
        if (this.playing && this.currentSong !== null) {
          return (this.currentSong.id === id)
        }
        return false
      },
      detailArtist(song) {
        if (song) {
          return this.$store.getters['artists/detailLink'](song.artist)
        }
        return '/'
      },
      detailAlbum(song) {
        if (song) {
          return {
            name: 'detail_album',
            params: { artist: song.artist.name, album: song.album.name, id: song.album.id }
          }
        }
        return '/'
      }
    },
    computed: {
      playing() {
        return this.$store.getters['playlist/isPlaying']
      },
      currentSong() {
        return this.$store.getters['playlist/getCurrentSong']
      },
      displayArtist() {
        return this.showArtist
      }
    }
  }
</script>
<style>

</style>
