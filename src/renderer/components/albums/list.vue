<template>
    <section class="overview-list">
        <loading v-if="loadedAlbums == false"></loading>
        <transition-group name="list" tag="ul" class="list">
            <li class="col" v-for="album in albums" :key="album.id" :name="album.id">
                <album :album-id=album.id :album=album :key="album.id"></album>
            </li>
        </transition-group>
        <pagination for="albums" :records="totalAlbums" :vuex="true"></pagination>
    </section>
</template>

<script>
  import LoadingBars from '@/components/misc/loading-bars'
  import album from './album'
  import Toaster from '@/services/toast'
  import loading from '@/components/misc/loading-bars'

  export default {
    props: {
      type: {
        type: String,
        required: false,
        default: 'all'
      }
    },
    components: {
      LoadingBars,
      album,
      loading
    },
    data() {
      return {
        loadedAlbums: false,
        toast: new Toaster()
      }
    },
    created() {
      this.$store.dispatch('albums/sortBy', this.type)
    },
    beforeDestroy() {
      this.toast = null
      delete this.toast
      delete this.loadedAlbums
    },

    watch: {
      type() {
        this.$store.dispatch('albums/sortBy', this.type)
      }
    },
    computed: {
      albums() {
        if (this.albumPage) {
          this.$store.dispatch('albums/loadAlbumCollection', this.albumPage).then(() => {
            this.loadedAlbums = true
          }).catch(() => {
            this.loadedAlbums = true
          })
        }
        if (this.loadedAlbums) {
          return this.albumPage
        }
        return null
      },
      albumPage() {
        this.loadedAlbums = false
        return this.$store.getters['albums/albums']
      },
      totalAlbums() {
        return this.$store.getters['albums/totalAlbums']
      }
    }
  }
</script>
