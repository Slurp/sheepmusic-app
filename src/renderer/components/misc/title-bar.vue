<template>
    <nav class="title-bar">
        <user-badge></user-badge>
    </nav>
</template>

<script>
  import config from '@/config/index'
  import userBadge from '@/components/header/user-badge'

  export default {
    name: 'title-bar',
    components: {
      userBadge
    },
    data() {
      return {
        appTitle: config.appTitle
      }
    }
  }
</script>