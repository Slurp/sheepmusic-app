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
        <ul class="nav nav-tabs active" id="searchTabs" role="tablist">
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
        <div class="tab-content" id="searchTabsContent">
            <div class="tab-pane fade show active"
                 id="artists"
                 v-if="artists"
                 role="tabpanel"
                 aria-labelledby="artists-tab">
                <transition-group name="list" tag="section" class="list">
                    <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                        <artist :artist-id=artist.id :artist=artist></artist>
                    </div>
                </transition-group>
            </div>
            <div class="tab-pane fade " id="albums" role="tabpanel" v-if="albums" aria-labelledby="albums-tab">
                <transition-group name="list" tag="section" class="list">
                    <div class="col" v-for="album in albums" :key="album.id" :name="album.id">
                        <album :album-id=album.id :album="album"></album>
                    </div>
                </transition-group>
            </div>
            <div class="tab-pane fade" id="songs" role="tabpanel" aria-labelledby="songs-tab" v-if="songs">
                <song-list :songs="songs" :show-artist=true></song-list>
            </div>
        </div>
    </article>
</template>

<script>
import album from '@/components/albums/album'
import artist from '@/components/artists/artist'
import songList from '@/components/songs/list'

export default {
  name: 'search-results',
  props: ['query'],
  components: {
    album,
    artist,
    songList
  },
  data() {
    return {
      results: null
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
      if (this.results) {
        return this.results
      }
      return null
    },
    albums() {
      if (this.searchResults) {
        return this.$store.getters['albums/search'](this.searchResults.albums)
      }
      return false
    },
    artists() {
      if (this.searchResults) {
        return this.$store.getters['artists/search'](this.searchResults.artists)
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
