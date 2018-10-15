<template>
    <section class="overview-list">
        <loading v-if="loadedPage == false"></loading>
        <transition-group name="list" tag="ul" class="list">
            <li class="col" v-for="item in items" :key="item.id" :name="item.id">
                <album :album-id=item.id :album=item :key="item.id"></album>
            </li>
        </transition-group>
        <pagination for="albums" :records="records" :vuex="true"></pagination>
    </section>
</template>

<script>
  import LoadingBars from '@/components/misc/loading-bars'
  import album from './album'
  import Toaster from '@/services/toast'
  import loading from '@/components/misc/loading-bars'

  export default {
    props: {
      type: {
        type: String,
        required: false,
        default: 'all'
      }
    },
    components: {
      LoadingBars,
      album,
      loading
    },
    data() {
      return {
        loadedPage: false,
        toast: new Toaster()
      }
    },
    created() {
      this.$store.dispatch('albums/sortBy', this.type)
    },
    beforeDestroy() {
      this.toast = null
      delete this.toast
      delete this.loadedPage
    },

    watch: {
      type() {
        this.$store.dispatch('albums/sortBy', this.type)
      }
    },
    computed: {
      items() {
        if (this.page) {
          this.$store.dispatch('albums/loadSlice', this.page).then(() => {
            this.loadedPage = true
          }).catch(() => {
            this.loadedPage = true
          })
        }
        if (this.loadedPage) {
          return this.page
        }
        return null
      },
      page() {
        this.loadedPage = false
        return this.$store.getters['albums/slice']
      },
      records() {
        return this.$store.getters['albums/totals']
      }
    }
  }
</script>
