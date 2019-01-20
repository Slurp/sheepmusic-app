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
        <alphabet v-if="type == 'alphabet'"></alphabet>
        <list :type=type v-else></list>
    </div>
</template>

<script>
import list from './list'
import alphabet from './alphabet'

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
    list
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
