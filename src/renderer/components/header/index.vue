<template>
    <nav class="navbar navbar-expand-sm sticky" v-stick="stickyOptions" role="navigation">
        <a href="#" aria-controls="doc_navdrawer" aria-expanded="false" aria-label="Toggle Navdrawer"
           class="navbar-brand" data-target="#doc_navdrawer" data-toggle="navdrawer" data-type="permanent">
            <span class="brand-logo"></span>
        </a>
        <search-box></search-box>
        <user-badge></user-badge>
    </nav>
</template>

<script>
import config from '../../config'
import Sticky from 'sticky-js'
import searchBox from 'components/search/search-box'
import userBadge from './user-badge'

export default {
  name: 'navbar-header',
  components: {
    searchBox,
    userBadge
  },
  data() {
    return {
      appTitle: config.appTitle,
      stickyOptions: {
        marginTop: 0,
        for: 0,
        className: 'is-sticky',
        wrap: true
      }
    }
  },
  directives: {
    stick: {
      inserted(el, binding) {
        el.parentNode.setAttribute('data-sticky-container', '')
        if (binding.value) {
          if (binding.value.marginTop) {
            el.setAttribute('data-margin-top', binding.value.marginTop)
          }
          if (binding.value.for) {
            el.setAttribute('data-sticky-for', binding.value.for)
          }
          if (binding.value.className) {
            el.setAttribute('data-sticky-class', binding.value.className)
          }
          if (binding.value.wrap) {
            el.setAttribute('data-sticky-wrap', binding.value.wrap)
          }
        }

        new Sticky('.sticky')
      }
    }
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
