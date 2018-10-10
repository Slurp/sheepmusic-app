<template>
    <article class="search-results">
        <div class="album-backdrop no-image">
            <div class="info-bar album media">
                <!--<img class="info-bar-image" :src="cover"/>-->
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1>Search results for
                            <small>{{ query }}</small>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <ul class="nav nav-tabs active" v-if="results" id="searchTabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active"
                   id="artists-tab"
                   data-toggle="tab"
                   href="#artists"
                   role="tab"
                   aria-controls="artists">
                    Artists
                </a>
            </li>
            <li class="nav-item">
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
            <li class="nav-item">
                <a class="nav-link"
                   id="songs-tab"
                   data-toggle="tab"
                   href="#songs"
                   role="tab"
                   aria-controls="songs"
                   aria-expanded="true">
                    Songs
                </a>
            </li>
        </ul>
        <div class="tab-content"  v-if="results" id="searchTabsContent">
            <div class="tab-pane fade show active"
                 id="artists"
                 role="tabpanel"
                 aria-labelledby="artists-tab">
                <transition-group  name="list" tag="section" class="list" v-if="artists">
                    <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                        <artist :artist-id=artist.id :artist=artist></artist>
                    </div>
                </transition-group>
                <loadingScreen v-else></loadingScreen>
            </div>
            <div class="tab-pane fade " id="albums" role="tabpanel" aria-labelledby="albums-tab">
                <transition-group  name="list" tag="section" class="list" v-if="albums">
                    <div class="col" v-for="album in albums" :key="album.id" :name="album.id">
                        <album :album-id=album.id :album="album"></album>
                    </div>
                </transition-group>
                <loadingScreen v-else></loadingScreen>
            </div>
            <div class="tab-pane fade" id="songs" role="tabpanel" aria-labelledby="songs-tab">
                <song-list :songs="songs" :show-artist=true v-if="songs"></song-list>
                <loadingScreen v-else></loadingScreen>
            </div>
        </div>
        <loadingScreen v-else></loadingScreen>
    </article>
</template>

<script>
import album from '@/components/albums/album'
import artist from '@/components/artists/artist'
import songList from '@/components/songs/list'
import loadingScreen from '@/components/misc/loading-bars'

export default {
  name: 'search-results',
  props: ['query'],
  components: {
    album,
    artist,
    songList,
    loadingScreen
  },
  data() {
    return {
      results: null,
      loadedAlbums: false,
      loadedArtists: false
    }
  },
  created() {
    this.search()
  },
  beforeDestroy() {
    this.results = null
    delete this.results
  },
  watch: {
    query(newQuery, oldQuery) {
      if (newQuery !== oldQuery) {
        this.results = null
        this.search()
      }
    }
  },
  methods: {
    search() {
      this.loadedArtists = false
      this.loadedAlbums = false
      this.axios.get(`/api/search/${this.query}`).then(response => {
        this.results = response.data
        this.$store.dispatch('albums/loadAlbumCollection', this.results.albums).then(() => {
          console.log('albums/loadAlbumCollection')
          this.loadedAlbums = this.$store.getters['albums/search'](this.results.albums)
        }).catch(() => {
          this.loadedAlbums = false
        })
        this.$store.dispatch('artists/loadArtistCollection', this.results.artists).then(() => {
          this.loadedArtists = this.$store.getters['artists/search'](this.results.artists)
        }).catch(() => {
          this.loadedArtists = false
        })
      }, () => {})
    }
  },
  computed: {
    albums() {
      return this.loadedAlbums
    },
    artists() {
      return this.loadedArtists
    },
    songs() {
      if (this.results) {
        return this.results.songs
      }
      return false
    }
  }
}
</script>

<style>
</style>
