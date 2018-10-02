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
            <li class="nav-item" v-if="artists">
                <a class="nav-link active"
                   id="artists-tab"
                   data-toggle="tab"
                   href="#artists"
                   role="tab"
                   aria-controls="artists">
                    Artists
                </a>
            </li>
            <li class="nav-item" v-if="albums">
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
            <li class="nav-item" v-if="songs">
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
                 aria-labelledby="artists-tab"
                 v-if="artists">
                <transition-group  v-if="loadedArtists" name="list" tag="section" class="list">
                    <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                        <artist :artist-id=artist.id :artist=artist></artist>
                    </div>
                </transition-group>
                <loading-circle v-else></loading-circle>
            </div>
            <div class="tab-pane fade " id="albums" role="tabpanel" v-if="albums" aria-labelledby="albums-tab">
                <transition-group v-if="loadedAlbums" name="list" tag="section" class="list">
                    <div class="col" v-for="album in albums" :key="album.id" :name="album.id">
                        <album :album-id=album.id :album="album"></album>
                    </div>
                </transition-group>
                <loading-circle v-else></loading-circle>
            </div>
            <div class="tab-pane fade" id="songs" role="tabpanel" aria-labelledby="songs-tab" v-if="songs">
                <song-list :songs="songs" :show-artist=true></song-list>
            </div>
        </div>
        <loadingCircle v-else></loadingCircle>
    </article>
</template>

<script>
import album from '@/components/albums/album'
import artist from '@/components/artists/artist'
import songList from '@/components/songs/list'
import loadingCircle from '@/components/misc/loading-circle'

export default {
  name: 'search-results',
  props: ['query'],
  components: {
    album,
    artist,
    songList,
    loadingCircle
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
        this.loadedArtists = false
        this.loadedAlbums = false
        this.search()
      }
    }
  },
  methods: {
    search() {
      this.axios.get(`/api/search/${this.query}`).then(response => {
        this.results = response.data
      }, () => {
      })
    }
  },
  computed: {
    searchResults() {
      return this.results
    },
    albums() {
      if (this.searchResults) {
        const results = this.$store.getters['albums/search'](this.searchResults.albums)
        if (this.loadedAlbums) {
          return results
        }
        this.$store.dispatch('albums/loadAlbumCollection', results).then(() => {
          this.loadedAlbums = true
          return results
        }).catch(() => {
          this.loadedAlbums = true
          return results
        })
      }
      return null
    },
    artists() {
      if (this.searchResults) {
        const results = this.$store.getters['artists/search'](this.searchResults.artists)
        if (this.loadedArtists) {
          console.log('return artists')
          return results
        }
        this.$store.dispatch('artists/loadArtistCollection', results).then(() => {
          console.log('loaded artist')
          this.loadedArtists = true
          return results
        }).catch(() => {
          this.loadedArtists = true
          return results
        })
      }
      return false
    },
    songs() {
      if (this.searchResults) {
        return this.searchResults.songs
      }
      return false
    }
  }
}
</script>

<style>
</style>
