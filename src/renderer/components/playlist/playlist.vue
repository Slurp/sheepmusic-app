<template>
    <div class="playlist">
        <div class="playlist-dropup">
            <h5 class="playlist-header">
                <span v-if="playlistName">{{ playlistName }}</span>
                <span v-else>Current Playlist</span>
            </h5>
            <div class="playlist-wrapper">
                <ul v-if="isEmpty">
                    <li class="playlist-item" >
                        <i class="material-icons">queue_music</i>
                        <div class="playlist-item-info">
                            <h5 class="mt-0">NO NO NO</h5>
                            <h6>There is no playlist</h6>
                        </div>
                    </li>
                </ul>
                <draggable v-model="list" v-else>
                    <transition-group name="playlist-list" tag="ul">
                        <song-item
                                v-for="(song, index) in list"
                                :song="song"
                                :index="index"
                                class="playlist-item"
                                v-bind:class="{ isplaying: isPlaying(index), 'ispaused': isPaused(index)  }"
                                :key="song.id"
                                :name="index">
                        </song-item>

                    </transition-group>
                </draggable>
            </div>

            <div v-if="isEmpty == false" class="playlist-actions" role="group">
                <div class="btn-group-fluid">
                    <a href="#" class='btn' v-on:click.stop.prevent="shuffle">
                        <i class="material-icons">shuffle</i>
                    </a>
                    <a href="#" class='btn' v-bind:class="repeatMode" v-bind:title="repeatStatus"
                       v-on:click.stop.prevent="changeRepeatMode">
                        <i v-if="repeatMode == 'REPEAT_ONE'" class="material-icons">repeat_one</i>
                        <i v-if="repeatMode == 'NO_REPEAT'" class="material-icons">repeat</i>
                        <i v-if="repeatMode == 'REPEAT_ALL'" class="material-icons">repeat</i>
                    </a>
                    <a href="#" class='btn' data-toggle="modal" data-target="#playlistModal">
                        <i class="material-icons">save</i>
                    </a>
                    <a href="#" class='btn' v-on:click.stop.prevent="clear">
                        <i class="material-icons">
                            delete
                        </i>
                    </a>
                </div>
                <div class="duration" v-if="playlistDuration">
                    <i class="material-icons">av_timer</i>
                    {{ playlistDuration }}
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import songItem from './song'
import { secondsToHis } from '@/services/time'
import draggable from 'vuedraggable'

export default {
  name: 'playlist',
  components: {
    songItem,
    draggable
  },
  data() {
    return {
      repeatStatus: ''
    }
  },
  methods: {
    isPlaying(index) {
      if (this.playing && this.currentSong !== null) {
        return (this.currentIndex === index)
      }
      return false
    },
    isPaused(index) {
      if (this.paused && this.currentSong !== null) {
        return (this.currentIndex === index)
      }
      return false
    },
    shuffle() {
      this.$store.dispatch('playlist/shuffle')
    },
    clear() {
      this.$store.dispatch('playlist/clear')
    },
    changeRepeatMode() {
      this.$store.dispatch('playlist/setRepeatMode', this.repeatMode)
    }
  },
  computed: {
    playing() {
      return this.$store.getters['playlist/isPlaying']
    },
    paused() {
      return this.$store.getters['playlist/isPaused']
    },
    currentIndex() {
      return this.$store.getters['playlist/getCurrentSelectedItem']
    },
    currentSong() {
      return this.$store.getters['playlist/getCurrentSong']
    },
    isEmpty() {
      return (this.list.length === 0)
    },
    list: {
      get() {
        return this.$store.getters['playlist/list']
      },
      set(value) {
        this.$store.dispatch('playlist/updateList', value)
      }
    },
    repeatMode() {
      this.repeatStatus = this.$store.getters['playlist/repeatMode']
      return this.repeatStatus
    },
    playlistName() {
      return this.$store.getters['playlist/name']
    },
    playlistDuration() {
      if (this.isEmpty === false) {
        this.duration = secondsToHis(this.list.map(song => song.length).reduce((acc, val) => parseInt(acc, 10) + parseInt(val, 10), 0))
        return this.duration
      }
      return null
    }
  }
}
</script>
