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
                <playlist :playlist-id=listItem.listitem.id :playlist="listItem.listitem" v-bind:key="listItem.listitem.id"></playlist>
            </template>
        </list>
    </div>
</template>

<script>
import playlist from './playlists'
import list from '@/components/list/list'

export default {
    name:       'playlist-overview',
    props:      ['type'],
    components: {
        playlist,
        list
    }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
