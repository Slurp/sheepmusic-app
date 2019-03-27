<template>
    <div class="library-detail artist-detail" :id="playlist.id" v-if="playlist">
        <breadcrumbs></breadcrumbs>
        <div class="backdrop" v-if="background">
            <div class="image-backdrop" v-bind:style="{ 'background-image': 'url(' + background + ')' }">>
            </div>
        </div>
        <section>
            <div class="detail-info-wrapper">
                <div class="detail-info">
                    <div class="detail-header">
                        <h1>{{ playlist.name }}</h1>
                        <div class="actions">
                            <playBtn :playlist=playlist></playBtn>
                            <queueBtn :playlist=playlist></queueBtn>
                            <shuffle-playlist-btn :playlist=playlist></shuffle-playlist-btn>
                        </div>
                    </div>
                    <div class="meta" v-if="playlistDuration">
                        <span class="chip">
                            <span class="chip-icon">
                                <i class="material-icons">av_timer</i>
                            </span>
                            {{ playlistDuration }}
                        </span>
                        <span class="chip">
                            <span class="chip-icon">
                                <i class="material-icons">filter_list</i>
                            </span>
                            {{ this.playlist.songs.length }}
                        </span>
                    </div>
                </div>
            </div>
            <song-list :songs="playlist.songs"></song-list>
        </section>
    </div>
</template>

<script>
import ShufflePlaylistBtn from '@/components/playlists/shuffle-btn'
import config from '@/config/index'
import songList from '@/components/songs/list'
import breadcrumbs from '@/components/misc/breadcrumbs'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { secondsToHis } from '@/services/time'

export default {
  name: 'playlist-detail',
  components: {
    ShufflePlaylistBtn,
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
    background() {
      if (this.playlist && this.playlist.cover) {
        return `'${config.baseUrl}/${this.playlist.cover}'`
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
