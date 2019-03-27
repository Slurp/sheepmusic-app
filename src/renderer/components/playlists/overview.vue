<template>
    <div class="overview">
        <ul class="nav nav-tabs router-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-playlists'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-playlists'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <section class="overview-list">
        <transition-group name="list" tag="div" class="list" v-if="playlistPage">
            <div class="col" v-for="(playlist, index) in playlistPage" :key="playlist.id" :name="playlist.id">
                <playlist :playlist-id=index :playlist=playlist :key="playlist.id"></playlist>
            </div>
        </transition-group>

        <pagination for="playlists" :records="totalPlaylists" :vuex="true"></pagination>
        </section>
    </div>
</template>

<script>
import playlist from './playlists'
import Toaster from '@/services/toast'

export default {
  name: 'playlist-overview',
  props: ['type'],
  components: {
    playlist
  },
  data() {
    return {
      toast: new Toaster()
    }
  },
  beforeDestroy() {
    this.toast = null
    delete this.toast
  },
  watch: {
    type() {
      this.$store.dispatch('playlists/sortBy', this.type)
    }
  },
  computed: {
    playlistPage() {
      return this.$store.getters['playlists/getPlaylists']
    },
    totalPlaylists() {
      return this.$store.getters['playlists/totalPlaylists']
    }

  },
  created() {
    this.$store.dispatch('playlists/loadPlaylists').then(() => {
      this.toast.toast('loaded playlists')
    }).catch(() => {
      this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
    })
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
