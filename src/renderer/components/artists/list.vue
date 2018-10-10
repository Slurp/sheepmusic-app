<template>
    <section class="overview-list">
        <loading v-if="loadedArtists == false"></loading>
        <transition-group name="list" tag="ul" class="list">
            <li class="col" v-for="artist in artists" :key="artist.id" :name="artist.id" >
                <artist :artist-id=artist.id :artist=artist></artist>
            </li>
        </transition-group>
        <pagination for="artists" :records="totalArtists" :vuex="true"></pagination>
    </section>
</template>

<script>
  import artist from './artist'
  import loading from '@/components/misc/loading-bars'

  export default {
    props: ['type'],
    components: {
      artist,
      loading
    },
    created() {
      this.$store.dispatch('artists/sortBy', this.type)
    },
    data() {
      return {
        loadedArtists: false
      }
    },
    watch: {
      type() {
        this.$store.dispatch('artists/sortBy', this.type)
      }
    },
    computed: {
      artists() {
        if (this.artistPage) {
          this.$store.dispatch('artists/loadArtistCollection', this.artistPage).then(() => {
            this.loadedArtists = true
          }).catch(() => {
            this.loadedArtists = true
          })
        }
        if (this.loadedArtists) {
          return this.artistPage
        }
        return null
      },
      artistPage() {
        this.loadedArtists = false
        return this.$store.getters['artists/artists']
      },
      totalArtists() {
        return this.$store.getters['artists/totalArtists']
      }
    }
  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
