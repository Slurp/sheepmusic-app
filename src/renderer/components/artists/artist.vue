<template>
    <router-link :to="detailLink"
                 class="card card__overview">
        <div class="card-img">
            <img class="card-img-top"
                 v-lazyload
                 :alt="artist.name"
                 :src=defaultCover
                 :data-src=cover
                 :data-err=defaultCover
            />
            <ul class="action-sheet" v-if="loadedArtist">
                <li>
                    <playBtn :artist=artist></playBtn>
                </li>
                <li>
                    <queueBtn :artist=artist></queueBtn>
                </li>
            </ul>
        </div>

        <div class="card-body has-sheet">

            <div class="card-block" v-if="loadedArtist">
                <h4 class="card-title">{{artist.name}}</h4>
                <h6 class="card-subtitle text-muted"><i class="material-icons">album</i>{{ artist.albums.length }}</h6>
            </div>
            <div class="progress" v-else>
                <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
            </div>
        </div>
    </router-link>
</template>

<script>
 
import Toaster from '@/services/toast'
import config from '@/config/index'
import playBtn from './play-btn'
import queueBtn from './queue-btn'
import { maybe } from '../../services/functional-tools'
import { getCover } from '../../store/modules/artists/model'

export default {
   name: 'artistList',
   props: ['artist', 'artistId'],
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
