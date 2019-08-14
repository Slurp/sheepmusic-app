<template>
    <div class="overview">
        <ul class="nav nav-tabs router-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'alphabet-artists'}">
                    <span>All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-artists'}">
                    <span>Recent</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'random-artists'}">
                    <span>Random</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'most-played-artists'}">
                    <span>Most-played</span>
                </router-link>
            </li>
        </ul>
        <alphabet v-if="type == 'alphabet'" for-store="artists">
            <template slot-scope="listItem">
                <artist :artist-id="listItem.listitem.id" :artist="listItem.listitem" :key="listItem.listitem.id"></artist>
            </template>
        </alphabet>
        <list :type=type for-store="artists" v-else>
            <template slot-scope="listItem">
                <artist :artist-id="listItem.listitem.id" :artist="listItem.listitem" :key="listItem.listitem.id"></artist>
            </template>
        </list>
    </div>
</template>

<script>
import list from '@/components/list/list'
import alphabet from '@/components/list/alphabet'
import artist from './artist'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'alphabet'
    }
  },
  components: {
    alphabet,
    list,
    artist
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
