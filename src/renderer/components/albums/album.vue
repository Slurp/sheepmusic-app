<template>
    <router-link :to="detailLink"
                 class="card card__overview">
        <div class="card-img">
            <img class="card-img-top"
                 v-lazyload
                 :alt="album.name"
                 :src=defaultCover
                 :data-src=cover
                 :data-err=defaultCover
            />
            <ul class="action-sheet" v-if="loadedAlbum">
                <li>
                    <playBtn :album=album></playBtn>
                </li>
                <li>
                    <queueBtn :album=album></queueBtn>
                </li>
            </ul>
        </div>
        <div class="card-body">
            <div class="progress" v-if="!loadedAlbum">
                <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
            </div>
            <div class="card-block" v-else>
                <h4 class="card-title">{{album.artist.name}}</h4>
                <h6 class="card-subtitle">{{album.name}}</h6>
            </div>
        </div>
    </router-link>
</template>

<script>
import Toaster from '@/services/toast'
import config from '@/config/index'
import playBtn from './play-btn'
import queueBtn from './queue-btn'

export default {
  props: ['album', 'albumId'],
  components: {
    playBtn,
    queueBtn
  },
  data() {
    return {
      openSheet: false,
      toast: new Toaster(),
      loaded: false,
      defaultCover: config.defaultCover
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
      if (!this.album || this.album.fullyLoaded === false) {
        console.log(this.albumId)
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
      return (this.loaded && (this.album !== null && this.album.fullyLoaded))
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
