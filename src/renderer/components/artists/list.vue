<template>
    <section class="overview-list">
        <loading v-if="loaded == false"></loading>
        <transition-group name="list" tag="ul" class="list">
            <li class="col" v-for="item in items" :key="item.id" :name="item.id" >
                <artist :artist-id=item.id :artist=item></artist>
            </li>
        </transition-group>
        <pagination for="artists" :records="records" :vuex="true"></pagination>
    </section>
</template>

<script>
  import artist from './artist'
  import loading from '@/components/misc/loading-bars'

  export default {
    props: ['type'],
    components: {
      artist,
      loading
    },
    created() {
      this.$store.dispatch('artists/sortBy', this.type)
    },
    data() {
      return {
        loaded: false
      }
    },
    watch: {
      type() {
        this.$store.dispatch('artists/sortBy', this.type)
      }
    },
    computed: {
      items() {
        if (this.page) {
          this.$store.dispatch('artists/loadSlice', this.page).then(() => {
            this.loaded = true
          }).catch(() => {
            this.loaded = true
          })
        }
        if (this.loaded) {
          return this.page
        }
        return null
      },
      page() {
        this.loaded = false
        return this.$store.getters['artists/slice']
      },
      records() {
        return this.$store.getters['artists/totals']
      }
    }
  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
