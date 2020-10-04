<template>
  <nav class="navbar navbar-expand-sm sticky" role="navigation">
    <a class="navbar-brand" href="#" @click.stop.prevent="$router.back()">
            <span class="brand-logo">
            </span>
      <i class="material-icons brand-back">
        chevron_left
      </i>
    </a>
  </nav>
</template>

<script>


  export default {
    name:    'navbar-header',
    methods: {
      logout()
      {
        this.$auth.logout({
          makeRequest: true
        }).then(() => {

        })

      }
    }
  }
</script>

<style>
</style>
