<template>
    <ol class="breadcrumb breadcrumb-fixed">
        <li class="breadcrumb-item active" v-if="artist">
            {{ artist.name }}
        </li>
        <li class="breadcrumb-item" v-else-if="album">
            <router-link :to=detailArtist>
                {{ album.artist.name }}
            </router-link>
        </li>
        <li class="breadcrumb-item active" v-if="album">
            {{ album.name }}
        </li>
    </ol>
</template>
<script>
  export default {
    props: [
      'album',
      'artist',
      'logo'
    ],
    computed: {
      detailArtist() {
        if (this.album && this.album.name && this.album.artist) {
          return this.$store.getters['artists/detailLink'](this.album.artist)
        }
        return '/'
      }
    }
  }
</script>
