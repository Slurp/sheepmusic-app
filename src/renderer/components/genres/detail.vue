<template>
    <div class="genre-detail"  v-if="genre">
        <div class="album-backdrop no-image">
            <div class="info-bar album media">
                <!--<img class="info-bar-image" :src="cover"/>-->
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1 class="album-name">{{ genre.name }}</h1>
                    </div>
                </div>
            </div>
        </div>
        <ul class="nav nav-tabs active" id="searchTabs" role="tablist">
            <li class="nav-item" v-if="genre.artists">
                <a class="nav-link active"
                   id="artists-tab"
                   data-toggle="tab"
                   href="#artists"
                   role="tab"
                   aria-controls="artists">
                    Artists</a>
            </li>
            <li class="nav-item" v-if="genre.albums">
                <a class="nav-link"
                   id="albums-tab"
                   data-toggle="tab"
                   href="#albums"
                   role="tab"
                   aria-controls="albums"
                   aria-expanded="true">
                    Albums
                </a>
            </li>
        </ul>
        <div class="tab-content" id="searchTabsContent">
            <div class="tab-pane fade show active" id="artists" v-if="genre.artists" role="tabpanel" aria-labelledby="artists-tab">
                <transition-group name="list" tag="section" class="list"  v-if="artists">
                    <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                        <artist :artist-id=artist.id :artist=storedArtist(artist.id)></artist>
                    </div>
                </transition-group>
                <div v-else>
                    Loading
                </div>
            </div>
            <div class="tab-pane fade" id="albums" role="tabpanel" v-if="genre.albums" aria-labelledby="albums-tab">
                <transition-group name="list" tag="div" class="list" v-if="albums">
                    <div class="col" v-for="album in albums" :key="album.id" :name="album.id">
                        <album :album-id=album.id :album=storedAlbum(album.id) :key="album.id"></album>
                    </div>
                </transition-group>
                <div v-else>
                    Loading
                </div>
            </div>
        </div>


    </div>
</template>

<script>
import config from '@/config/index'
import album from '@/components/albums/album'
import artist from '@/components/artists/artist'
import playBtn from './play-btn'
import queueBtn from './queue-btn'

export default {
  name: 'genre-detail',
  data() {
    return {
      loadedAlbums: false,
      loadedArtists: false
    }
  },
  components: {
    album,
    artist,
    playBtn,
    queueBtn
  },
  props: ['id'],
  created() {
    this.$store.dispatch('genres/loadGenre', this.id)
    this.$store.dispatch('genres/viewGenre', this.id)
  },
  methods: {
    storedAlbum(albumId) {
      return this.$store.getters['albums/getAlbumById'](albumId)
    },
    storedArtist(artistId) {
      return this.$store.getters['artists/getArtistById'](artistId)
    }
  },
  computed: {
    cover() {
      if (this.genre && this.genre.cover) {
        return `${config.baseUrl}/${this.genre.cover}`
      }
      return ''
    },
    artists() {
      if (this.genre && this.genre.artists) {
        this.$store.dispatch('artists/loadArtistCollection', this.genre.artists).then(() => {
          this.loadedArtists = true
        }).catch(() => {
          this.loadedArtists = true
        })
      }
      if (this.loadedArtists) {
        return this.genre.artists
      }
      return null
    },
    albums() {
      if (this.genre && this.genre.albums) {
        this.$store.dispatch('albums/loadAlbumCollection', this.genre.albums).then(() => {
          this.loadedAlbums = true
        }).catch(() => {
          this.loadedAlbums = true
        })
      }
      if (this.loadedAlbums) {
        return this.genre.albums
      }
      return null
    },
    genre() {
      if (this.id) {
        return this.$store.getters['genres/getGenreById'](this.id)
      }
    }
  }
}
</script>
<style>

</style>
