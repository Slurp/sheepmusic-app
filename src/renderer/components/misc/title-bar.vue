<template>
    <nav class="title-bar">
        <router-link class="btn-sm btn-secondary"
                     :to="{ path: $routerHistory.previous().path }">
            <i class="material-icons">
                chevron_left
            </i>
        </router-link>
    </nav>
</template>

<script>
  import config from '../../config'

  export default {
    name: 'title-bar',
    data() {
      return {
        appTitle: config.appTitle
      }
    }
  }
</script>

<style>
</style>
