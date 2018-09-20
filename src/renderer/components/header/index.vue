<template>
    <nav class="navbar navbar-expand-sm sticky" role="navigation">
        <a href="#" aria-controls="doc_navdrawer" aria-expanded="false" aria-label="Toggle Navdrawer"
           class="navbar-brand" data-target="#doc_navdrawer" data-toggle="navdrawer" data-type="permanent">
            <span class="brand-logo"></span>
        </a>
        <search-box></search-box>
        <user-badge></user-badge>
    </nav>
</template>

<script>
import searchBox from '@/components/search/search-box'
import userBadge from './user-badge'

export default {
  name: 'navbar-header',
  components: {
    searchBox,
    userBadge
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
