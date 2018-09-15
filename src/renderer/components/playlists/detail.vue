<template>
    <div class="library-detail" :id="playlist.id" v-if="playlist">
        <breadcrumbs></breadcrumbs>
        <div class="backdrop">
            <div class="image-backdrop" v-bind:style="{ 'background-image': 'url(' + cover + ')' }"></div>
        </div>
        <section>
            <div class="detail-info-wrapper">
                <div class="detail-art">
                    <img
                            v-lazyload
                            :alt="playlist.name"
                            :src=defaultCover
                            :data-src=cover
                            :data-err=defaultCover
                            class="card-img-top"
                    />
                </div>
                <div class="detail-info">
                    <h1>{{ playlist.name }}</h1>
                    <div class="meta">
                        <span v-if="playlistDuration">
                            <i class="material-icons">av_timer</i>
                            {{ playlistDuration }}
                        </span>
                    </div>
                </div>
                <div class="actions">
                    <play_btn :playlist=playlist></play_btn>
                    <queue_btn :playlist=playlist></queue_btn>
                </div>
            </div>
        </section>
        <song-list :songs="playlist.songs"></song-list>
    </div>
</template>

<script>
import config from 'config/index'
import songList from 'components/songs/list'
import breadcrumbs from 'components/misc/breadcrumbs'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { secondsToHis } from 'services/time'

export default {
  name: 'playlist-detail',
  components: {
    songList,
    breadcrumbs,
    playBtn,
    queueBtn
  },
  props: ['id'],
  created() {
    this.$store.dispatch('playlists/loadPlaylist', this.id)
    this.$store.dispatch('playlists/viewPlaylist', this.id)
  },
  data() {
    return {
      defaultCover: config.defaultCover
    }
  },
  computed: {
    cover() {
      if (this.playlist.cover) {
        return `${config.baseUrl}/${this.playlist.cover}`
      }
      return null
    },
    playlist() {
      return this.$store.getters['playlists/getPlaylistById'](this.id)
    },
    playlistDuration() {
      if (this.playlist && typeof (this.playlist.songs) !== 'undefined') {
        return secondsToHis(this.playlist.songs.map(song => (song ? song.length : 0)).reduce((acc, val) => parseInt(acc, 10) + parseInt(val, 10), 0))
      }
      return null
    }
  }
}
</script>
<style>

</style>
