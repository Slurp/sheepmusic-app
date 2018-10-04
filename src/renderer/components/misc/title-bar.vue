<template>
    <nav class="title-bar">
        <search-box></search-box>
    </nav>
</template>

<script>
  import config from '../../config'
  import searchBox from '@/components/search/search-box'

  export default {
    name: 'title-bar',
    components: {
      searchBox
    },
    data() {
      return {
        appTitle: config.appTitle
      }
    }
  }
</script>

<style>
</style>
