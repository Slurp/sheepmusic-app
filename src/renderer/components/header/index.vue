<template>
    <nav class="navbar navbar-expand-sm sticky" role="navigation">
        <a  class="navbar-brand" href="#" @click.stop.prevent="$router.back()">
            <span class="brand-logo">
            </span>
            <i class="material-icons brand-back">
                chevron_left
            </i>
        </a>

        <user-badge></user-badge>
    </nav>
</template>

<script>

import userBadge from './user-badge'

export default {
  name: 'navbar-header',
  components: {
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
