<template>
    <footer id='mainFooter' class='footer-player'>
        <div class='player'>
            <player-progress/>
            <div class="player-row">
                <player-info />
                <player-controls />
                <div class="player-desktop-controls">
                    <player-volume v-model="volume" />
                    <mute-btn />
                </div>
            </div>
        </div>
        <a href='#'
           class='btn btn-float btn-sm btn-secondary btn-equalizer'
           data-toggle='playlist'
           aria-haspopup='true'
           aria-expanded='false'
           v-on:click.stop.prevent="toggleEqualizer">
            <i class='material-icons'>equalizer</i>
        </a>
        <a href='#'
           class='btn btn-float btn-sm btn-secondary btn-playlist'
           data-toggle='playlist'
           aria-haspopup='true'
           aria-expanded='false'
           v-on:click.stop.prevent="togglePlaylist">
            <i class='material-icons'>queue_music</i>
        </a>
    </footer>
</template>
<script>

import Toaster from '@/services/toast'
import MuteBtn from 'components/player/Controls/muteBtn'
import equalizer from 'components/player/EqualizerWindow/index'
import PlayerProgress from 'components/player/Info/player-progress'
import playerInfo from './player-info'
import playerVolume from './player-volume'
import playerControls from './player-controls'

export default {
  name: 'player',
  components: {
    MuteBtn,
    PlayerProgress,
    playerInfo,
    playerVolume,
    playerControls,
    equalizer
  },
  data() {
    return {
      toast: new Toaster(),
      muted: false,
      volume: 100
    }
  },
  mounted() {
    this.$store.dispatch('playlist/setPlayingStatus', false)
  },
  computed: {
    playing() {
      return this.$store.getters['playlist/isPlaying']
    },
    stopped() {
      return !this.$store.getters['playlist/isPlaying']
    },
    currentSong() {
      return this.$store.getters['playlist/getCurrentSong']
    },
    playlist() {
      return this.$store.getters['playlist/list']
    },
    repeatMode() {
      this.repeatStatus = this.$store.getters['playlist/repeatMode']
      return this.repeatStatus
    }
  },
  watch: {
    volume() {
      this.$store.dispatch('player/setVolume', { volume: (this.volume / 10) })
      this.muted = this.volume === 0
    }
  },
  methods: {
    togglePlaylist() {
      this.$store.dispatch('togglePlaylist')
    },
    toggleEqualizer() {
      this.$store.dispatch('toggleEqualizer')
    }
  }
}
</script>
