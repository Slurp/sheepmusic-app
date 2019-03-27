<template>
    <article class="library-detail artist-detail" :id="id">
        <div v-if="artist && artist.fullyLoaded">
            <breadcrumbs :artist="artist" :logo="logo"></breadcrumbs>
            <div class="backdrop">
                <div class="image-backdrop artist-backdrop"
                     v-bind:style="{ 'background-image': 'url(' + background + ')' }"></div>
            </div>
            <section>
                <div class="detail-info-wrapper">
                    <div class="detail-art">
                        <div class="detail-art-img">
                            <img
                                    v-lazyload
                                    :alt="artist.name"
                                    :src=defaultCover
                                    :data-src=cover
                                    :data-err=defaultCover
                            />
                        </div>
                    </div>
                    <div class="detail-info">
                        <div class="detail-header">
                            <h1 class="artist-name" v-if="logo == null">{{ artist.name }}</h1>
                            <h1 class="artist-name" v-if="logo != null">
                                <img :src="logo">
                            </h1>
                            <div class="actions">
                                <playBtn :artist=artist></playBtn>
                                <queueBtn :artist=artist></queueBtn>
                                <editBtn :artist=artist></editBtn>
                                <playlist-artist-btn :artist=artist></playlist-artist-btn>
                            </div>
                        </div>
                        <div class="meta">
                            <span class="chip"><span class="chip-icon"><i class="material-icons">album</i></span>{{ artist.albums.length }}</span>
                            <span class="chip" v-if="genres" v-for="genre in genres">
                                <span class="chip-icon"><i class="material-icons">receipt</i></span>
                                <router-link
                                        :to="{ name: 'detail_genres', params: { genre: genre.name, id: genre.id }}">
                                    {{ genre.name }}
                                </router-link>
                            </span>
                        </div>
                        <truncate clamp="..." :length="90" less="Show Less" :text="artist.biography"></truncate>
                    </div>
                </div>
                <section class="list">
                    <h3 class="section-header">Albums</h3>
                    <div class="row">
                        <div class="col" v-for="album in albums" :key="album.id">
                            <album :album-id=album.id :album=album :key="album.id"></album>
                        </div>
                    </div>
                </section>

                <section class="list" v-if="artist.similar.length > 0">
                    <h3 class="section-header">Similar Artists</h3>
                    <div class="row">
                        <div class="col" v-for="similarArtist in similar">
                            <artist-card :artist-id=similarArtist.id
                                         :artist=similarArtist
                                         :key="similarArtist.id"></artist-card>
                        </div>
                    </div>
                </section>

            </section>
        </div>
        <loading-circle v-else></loading-circle>
    </article>

</template>

<script>
  import PlaylistArtistBtn from '@/components/artists/playlist-btn'
  import songList from '@/components/songs/list'
  import breadcrumbs from '@/components/misc/breadcrumbs'
  import album from '@/components/albums/album'
  import artistCard from '@/components/artists/artist'
  import config from '@/config/index'
  import loadingCircle from '@/components/misc/loading-circle'
  import truncate from './bio'
  import playBtn from './play-btn'
  import queueBtn from './queue-btn'
  import editBtn from './edit-btn'
  import { getBackground, getCover, getLogo } from '../../store/modules/artists/model'
  import { maybe } from '../../services/functional-tools'

  export default {
    name: 'artist_detail',
    components: {
      PlaylistArtistBtn,
      songList,
      breadcrumbs,
      album,
      artistCard,
      truncate,
      playBtn,
      queueBtn,
      editBtn,
      loadingCircle
    },
    data() {
      return {
        defaultCover: config.defaultCover
      }
    },
    props: ['id'],
    created() {
      this.loadArtistDetail()
    },
    methods: {
      loadArtistDetail() {
        if (!this.artist || !this.artist.fullyLoaded) {
          this.$store.dispatch('artists/loadArtist', this.id)
        }
        this.$store.dispatch('artists/viewArtist', this.id)
      }
    },
    asyncComputed: {
      async albums() {
        if (this.artist.albums !== 'undefined') {
          return this.$store.dispatch('albums/loadSlice', this.artist.albums.sort((a, b) => b.year - a.year).map(album => this.$store.getters['albums/getAlbumById'](album.id)))
        }
      },
      async similar() {
        if (this.artist.albums !== 'undefined') {
          return this.$store.dispatch('artists/loadSlice', this.artist.similar.map(artist => this.$store.getters['artists/getArtistById'](artist)))
        }
      }
    },
    computed: {
      genres() {
        return this.artist.genres
      },
      logo() {
        return maybe(this.artist, artist => getLogo(artist))
      },
      cover() {
        return maybe(this.artist, artist => getCover(artist))
      },
      background() {
        return maybe(this.artist, artist => getBackground(artist))
      },
      artist() {
        return this.$store.getters['artists/getArtistById'](this.id)
      }
    }
  }
</script>
<style>

</style>
