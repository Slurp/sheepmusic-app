<template>
    <div v-bind:class="loginScreen" id="app">
        <navbar v-if="$auth.check()"></navbar>
        <sidebar v-if="$auth.check() && loaded && !loading"></sidebar>
        <div class="container-fluid" v-if="loaded && !loading">
            <main class="router-view" role="main">
                <div class="left-column">
                    <router-view></router-view>
                </div>
                <playlist v-show="$auth.check() && !loading"></playlist>
            </main>
            <player-overlay></player-overlay>
        </div>
        <player v-show="$auth.check() && !loading"></player>
        <overlay v-if="(!$auth.ready() && !loaded ) || loading"></overlay>
        <modal-screens></modal-screens>
    </div>
</template>

<script>
import navbar from 'components/header/index'
import player from 'components/player/index'
import playerOverlay from 'components/player/overlay'
import playlist from 'components/playlist/playlist'
import overlay from 'components/misc/overlay'
import sidebar from 'components/sidebar/index'
import modalScreens from 'components/modals/screens'
import Toaster from 'services/toast'

export default {
  name: 'sheepmusic-app',
  components: {
    navbar, player, playlist, overlay, sidebar, modalScreens, playerOverlay
  },
  data() {
    return {
      loaded: false,
      toast: new Toaster(),
      showNowPlaying: false,
      playing: null
    }
  },
  computed: {
    loginScreen() {
      return {
        'playlist-show': this.loaded && this.$auth.check() && this.showPlaylist,
        'main-background': !this.$auth.check()
      }
    },

    loading() {
      return this.$store.getters.loading
    },
    showPlaylist() {
      return this.$store.getters.showPlaylist
    }
  },
  created() {
    this.readyState()
  },
  methods: {
    readyState() {
      this.$auth.ready(() => {
        this.$store.dispatch('toggleLoading')
        if (this.$auth.check()) {
          this.$store.dispatch('loggedIn').then(() => {
            this.loaded = true
            this.$store.dispatch('toggleLoading')
          }).catch(() => {
            this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
          })
        } else {
          this.$store.dispatch('toggleLoading')
          this.loaded = true
        }
      })
    }

  }
}
</script>

<style lang="scss">
    @import 'scss/style';
</style>
