<template>
    <li>
        <img
            v-lazyload
            :alt="song.title"
            :src=defaultCover
            :data-src=cover
            :data-err=defaultCover
        />
        <div class="playlist-item-info">
            <h5>{{ song.title }}</h5>
            <h6>{{ song.artist.name }} - {{ song.album.name }}</h6>
        </div>
        <div class="playlist-item-actions">
            <a class="playlist-item-actions__select" v-on:click.stop.prevent="select">
                <i class="material-icons">play_arrow</i>
            </a>
            <a class="playlist-item-actions__remove" v-on:click.stop.prevent="remove">
                <i class="material-icons">remove_from_queue</i>
            </a>
        </div>
    </li>
</template>
<script>
import config from '@/config/index'
export default {
  props: ['song', 'index'],
  data() {
    return {
        defaultCover: config.defaultCover
    }
  },
  methods: {
    select(event) {
      this.$store.dispatch('playlist/selectSong', this.index).then(() => {
        this.$store.dispatch('player/stop')
        this.$store.dispatch('player/play', { song: this.$store.getters['playlist/getCurrentSong'], restart: true })
      })
    },
    remove(event) {
      this.$store.dispatch('playlist/removeSong', this.index)
    }
  },
  computed: {
    cover() {
      if (this.song.album.cover) {
        return new URL(this.song.album.cover, config.baseUrl)
      }
      return config.defaultCover
    }
  }

}
</script>
<style>

</style>
