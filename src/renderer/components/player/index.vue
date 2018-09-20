<template>
    <footer id='mainFooter' class='footer-player'>

        <div class='player'>
            <div class="plyr plyr--audio plyr--ready" v-bind:class="{ 'plyr--playing': playing }">
                <div class="plyr__controls">
                    <div class="plyr__progress" v-on:mouseover="hoverProgress = true"
                         v-on:mouseout="hoverProgress = false">
                        <label for="seek" class="plyr__sr-only">Seek</label>
                        <input id="seek" ref="seekerElement" class="plyr__progress--seek" type="range" min="0" max="100"
                               step="0.1"
                               :value="progress" @mousedown="onSeekerMousedown">
                        <progress class="plyr__progress--played" max="100" :value="progress"
                                  role="presentation"></progress>
                        <progress class="plyr__progress--buffer" max="100" value="100"><span>100</span>% buffered
                        </progress>
                        <span class="plyr__tooltip" v-bind:class="{ 'plyr__tooltip--visible': hoverProgress }"
                              v-bind:style="{ left: progress + '%' }">{{ position }}</span>
                    </div>
                </div>
            </div>
            <div class="player-row">
                <player-info></player-info>
                <player-controls
                        :playing="playing"
                        :stopped="stopped"
                        v-on:playPrev="playPrev"
                        v-on:playNext="playNext"
                        v-on:rewind="rewind"
                        v-on:forward="forward"
                        v-on:play="play"
                        v-on:pause="pause"
                ></player-controls>

                <div class="player-desktop-controls">
                    <player-volume v-model="volume"></player-volume>
                    <button class="player__button" type='button' data-plyr='mute'>
                        <i class='material-icons icon--muted' v-if="muted">volume_off</i>
                        <i class='material-icons' v-else>volume_mute</i>
                        <span class='plyr__sr-only'>Toggle Mute</span>
                    </button>
                </div>
            </div>
        </div>
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
import BlackSheepPlayer from '@/components/BSAudioSuite/player'
import Notifications from '@/services/notifications'
import Toaster from '@/services/toast'
import { secondsToHis } from '@/services/time'
import playerInfo from './player-info'
import playerVolume from './player-volume'
import playerControls from './player-controls'

export default {
  name: 'player',
  components: {
    playerInfo,
    playerVolume,
    playerControls
  },
  data() {
    return {
      song: null,
      nextSong: null,
      blackSheepPlayer: null,
      toast: new Toaster(),
      muted: false,
      appTitle: document.title,
      loaded: 0,
      seek: 0,
      duration: 0,
      hoverProgress: false,
      mouseDownProgress: false,
      variableSeek: 0,
      volume: 100
    }
  },
  mounted() {
    this.$store.dispatch('playlist/setPlayingStatus', false)
    this.blackSheepPlayer = new BlackSheepPlayer(this)

    this.blackSheepPlayer.on('loaded', duration => {
      if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
        console.log('loaded')
      }
      this.duration = duration
      // grab next song.
      if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
        console.log(!this.nextSong || this.nextSong.preloaded)
      }
      if (!this.nextSong || this.nextSong.preloaded) {
        this.nextSong = this.$store.getters['playlist/getPreloadSong']
        if (!this.nextSong) {
        // Don't preload if
        // - there's no next song
          return
        }
        if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
          console.log('preload song')
        }
        this.blackSheepPlayer.preloadSong(this.nextSong)
        this.nextSong.preloaded = true
      }
    })
    /**
    * Listen to 'error' event on the audio player and play the next song if any.
    */
    this.blackSheepPlayer.on('playerror', () => {
      this.playNext()
    })
    // /**
    //  * Listen to 'ended' event on the audio player and play the next song in the queue.
    //  */
    this.blackSheepPlayer.on('end', () => {
      document.title = 'BSM ♫'
      this.$store.dispatch('songs/playedSong', this.song)
      this.seek = 0
      this.duration = 0
      this.playNext()
    })
    //
    this.blackSheepPlayer.on('play', () => {
      document.title = `BSM ♫ ${this.currentSong.title}`
      Notifications.notifySong(this.song)
      this.$store.dispatch('songs/announceSong', this.song)
    })

    this.blackSheepPlayer.on('seekUpdate', seek => {
      this.seek = seek
    })

    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('mouseup', this.onMouseUp)
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
    },

    progress() {
      if (this.mouseDownProgress) {
        return this.variableSeek * 100
      }
      return (this.duration === 0 ? 0 : this.seek / this.duration) * 100
    },
    position() {
      return secondsToHis(this.seek)
    }

  },
  watch: {
    currentSong(newSong, oldSong) {
      this.nextSong = null
      let forceSong = false
      if (oldSong === null || newSong.id !== oldSong.id || this.song === null) {
        this.song = newSong
        forceSong = true
        if (this.playing) {
          this.stop()
        }
      }
      this.play(forceSong)
    },
    volume() {
      this.blackSheepPlayer.setVolume(this.volume / 10)
      this.muted = this.volume === 0
    }
  },
  methods: {
    play(forceSong = false) {
      this.$store.dispatch('playlist/setPlayingStatus', true)
      if (this.blackSheepPlayer.isPaused() && forceSong === false) {
        this.blackSheepPlayer.resume()
        return
      }
      if (this.song !== null) {
        this.blackSheepPlayer.playSong(this.song)
        return
      }
      if (this.playlist !== null && this.playlist.length > 0) {
        this.playNext(true)
      }
    },
    pause() {
      document.title = 'BSM ♫ Paused'
      this.$store.dispatch('playlist/setPlayingStatus', false)
      this.blackSheepPlayer.pause()
    },
    stop() {
      this.blackSheepPlayer.stop()
    },
    playPrev() {
      if (this.repeatMode === 'REPEAT_ONE') {
        return this.play()
      }
      this.$store.dispatch('playlist/prevSong')
    },
    playNext() {
      this.nextSong = null
      if (this.repeatMode === 'REPEAT_ONE') {
        return this.play()
      }
      this.$store.dispatch('playlist/nextSong')
    },
    forward() {
      this.blackSheepPlayer.forward()
    },
    rewind() {
      this.blackSheepPlayer.rewind()
    },

    togglePlaylist() {
      this.$store.dispatch('togglePlaylist')
    },
    changeSeek(e) {
      this.blackSheepPlayer.setSeekPosition((this.duration / 100 * e.target.value))
    },
    onSeekerMousedown() {
      if (this.duration > 0) {
        this.mouseDownProgress = true
      }
    },
    onMouseMove(event) {
      if (this.mouseDownProgress === true) {
        this.variableSeek = this.calculatePercentage(event.clientX, this.$refs.seekerElement)
      }
    },
    onMouseUp() {
      if (this.mouseDownProgress === true) {
        this.mouseDownProgress = false
        this.blackSheepPlayer.setSeekPosition((this.$refs.seekerElement.value * this.duration) / 100)
      }
    },

    calculatePercentage(xPos, element) {
      return Math.min(1, Math.max(0, (xPos - element.getBoundingClientRect().left) / element.scrollWidth))
    },

    mute() {
      this.muted = true
      return this.blackSheepPlayer.mute()
    },
    /**
    * Unmute the volume.
    */
    unmute() {
      this.muted = false
      return this.blackSheepPlayer.unmute()
    }
  }
}
</script>
