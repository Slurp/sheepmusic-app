<template>
    <div class="library-detail album-detail" :id="id">
        <div v-if="album && album.fullyLoaded">
            <breadcrumbs :album="album"></breadcrumbs>
            <div class="backdrop">
                <div class="image-backdrop album-backdrop" v-bind:style="{ 'background-image': 'url(' + album.cover + ')' }"></div>
            </div>
            <section>

                <div class="detail-info-wrapper">
                    <div class="detail-art">
                        <div class="detail-art-img">
                            <img
                                 v-lazyload
                                 :alt="album.artist.name"
                                 :src=defaultCover
                                 :data-src=album.cover
                                 :data-err=defaultCover
                            />
                        </div>
                    </div>
                    <div class="detail-info">
                        <div class="actions">
                            <playBtn :album=album></playBtn>
                            <queueBtn :album=album></queueBtn>
                        </div>
                        <h3 class="artist-name">
                            <router-link
                                    :to="{ name: 'detail_artist', params: { artist: this.album.artist.name, id: this.album.artist.id }}">
                                <span v-if="logo == null">{{this.album.artist.name}}</span>
                                <img :src="logo" v-if="logo != null">
                            </router-link>
                        </h3>
                        <h1 class="detail-name">
                            {{ album.name }}
                        </h1>
                        <div class="meta">
                            <span class="chip"><span class="chip-icon"><i class="material-icons">hearing</i></span>{{ album.playCount}} times</span>
                            <span class="chip"><span class="chip-icon"><i class="material-icons">date_range</i></span>{{ album.year}}</span>
                            <span class="chip"><span class="chip-icon"><i class="material-icons">queue_music</i></span>{{ album.songs.length }} songs</span>
                            <span class="chip"><span class="chip-icon"><i class="material-icons">av_timer</i></span>{{ lengthAlbum }}</span>
                            <span class="chip" v-if="album.genre.name"><span class="chip-icon"><i class="material-icons">receipt</i></span>{{ album.genre.name}}</span>
                        </div>
                    </div>
                </div>
                    <song-list :songs="album.songs"></song-list>
            </section>
        </div>
        <loading-cirlce v-else></loading-cirlce>
    </div>
</template>

<script>
import songList from '@/components/songs/list'
import breadcrumbs from '@/components/misc/breadcrumbs'
import loadingCirlce from '@/components/misc/loading-circle'
import { secondsToHis } from '@/services/time'
import config from '@/config/index'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { getLogo } from '../../store/modules/artists/model'
import { maybe } from '../../services/functional-tools'

export default {
  name: 'album_details',
  components: {
    songList,
    breadcrumbs,
    playBtn,
    queueBtn,
    loadingCirlce
  },
  props: ['id'],
  data() {
    return {
      duration: '',
      defaultCover: config.defaultCover
    }
  },
  created() {
    if (this.album === null || this.album.fullyLoaded === false) {
      this.$store.dispatch('albums/loadAlbum', this.id)
    }
    this.$store.dispatch('albums/viewAlbum', this.id)
  },
  computed: {
    lengthAlbum() {
      if (typeof this.album !== 'undefined' && this.album.fullyLoaded === true) {
        this.duration = secondsToHis(this.album.songs.map(song => song.length).reduce((acc, val) => parseInt(acc, 10) + parseInt(val, 10), 0))
        return this.duration
      }
    },
    logo() {
      return maybe(this.artist, artist => getLogo(artist))
    },
    album() {
      return this.$store.getters['albums/getAlbumById'](this.id)
    },
    artist() {
      if (typeof this.album !== 'undefined' && this.album.fullyLoaded === true) {
        const artist = this.$store.getters['artists/getArtistById'](this.album.artist.id)
        if (typeof artist !== 'undefined' && artist.fullyLoaded === true) {
          return artist
        }
        this.$store.dispatch('artists/loadArtist', this.album.artist.id)
        return null
      }
      return null
    }
  }
}
</script>
<style>

</style>
