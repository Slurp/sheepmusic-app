<template>
    <nav class="title-bar">
        {{ appTitle }}
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
