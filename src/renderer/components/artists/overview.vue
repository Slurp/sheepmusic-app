<template>
    <div class="overview">
        <ul class="nav nav-tabs router-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-artists'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-artists'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <list :type="type"></list>
    </div>
</template>

<script>
import list from './list'

export default {
  props: ['type'],
  components: {
    list
  }
}
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
