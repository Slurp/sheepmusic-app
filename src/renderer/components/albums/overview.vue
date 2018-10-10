<template>
    <div>
        <ul class="nav nav-tabs router-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-albums'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
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
        </ul>
        <list :type=type></list>
    </div>
</template>

<script>
import list from './list'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'all'
    }
  },
  components: {
    list
  }
}
</script>
