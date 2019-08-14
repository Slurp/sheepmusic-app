<template>
    <div>
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
        <list :type=type for-store="playlists">
            <template slot-scope="listItem">
                <playlist :playlist-id=listItem.listitem.id :playlist="listItem.listitem" :key="listItem.listitem.name"></playlist>
            </template>
        </list>
    </div>
</template>

<script>
import playlist from './playlists'
import list from '@/components/list/list'

export default {
  name: 'playlist-overview',
  props: ['type'],
  components: {
    playlist,
    list
  },
  created() {
    this.$store.dispatch('playlists/loadLists').then(() => {
      this.$store.dispatch(`playlists/sortBy`, this.type)
    })
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
