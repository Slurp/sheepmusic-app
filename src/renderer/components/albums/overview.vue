<template>
    <div>
        <ul class="nav nav-tabs router-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-albums'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'most-played-albums'}">
                    <span class="font-weight-normal">Most Played</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'random-albums'}">
                    <span class="font-weight-normal">Random</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'alphabet-albums'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
        </ul>
        <alphabet v-if="type == 'alphabet'" for-store="albums">
            <template slot-scope="listItem">
                <album :album-id="listItem.listitem.id" :album="listItem.listitem" :key="listItem.listitem.id"></album>
            </template>
        </alphabet>
        <list :type=type for-store="albums" v-else>
            <template slot-scope="listItem">
                <album :album-id="listItem.listitem.id" :album="listItem.listitem" :key="listItem.listitem.id"></album>
            </template>
        </list>
    </div>
</template>

<script>
import alphabet from '@/components/list/alphabet'
import list from '@/components/list/list'
import album from './album'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'recent'
    }
  },
  components: {
    alphabet,
    list,
    album
  }
}
</script>
