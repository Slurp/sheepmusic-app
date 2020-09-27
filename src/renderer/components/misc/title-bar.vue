<template>
    <nav class="title-bar">
         <user-badge></user-badge><search-box></search-box>
    </nav>
</template>

<script>
  import config from '@/config/index'
  import userBadge from '@/components/header/user-badge'
  import searchBox from '@/components/search/search-box'

  export default {
    name: 'title-bar',
    components: {
      userBadge,
      searchBox
    },
    data() {
      return {
        appTitle: config.appTitle
      }
    }
  }
</script>
