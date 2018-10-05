<template>
    <nav class="navbar navbar-expand-sm sticky" role="navigation">
        <a  class="navbar-brand" href="#" @click.stop.prevent="$router.back()">
            <span class="brand-logo">
            </span>
            <i class="material-icons brand-back">
                chevron_left
            </i>
        </a>
        <search-box></search-box>
    </nav>
</template>

<script>
import searchBox from '@/components/search/search-box'

export default {
  name: 'navbar-header',
  components: {
    searchBox
  },
  methods: {
    logout() {
      this.$auth.logout({
        makeRequest: true,
        success() {

        },
        error() {
        }
      })
    }
  }
}
</script>

<style>
</style>
