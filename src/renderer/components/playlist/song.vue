<template>
    <li>
        <img :src="cover">
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
  methods: {
    select(event) {
      this.$store.dispatch('playlist/selectSong', this.index)
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
