<template>
    <section class="overview-list">
        <loading v-if="$asyncComputed.page.updating"></loading>
        <div v-else>
          <transition-group name="list" tag="ul" class="list">
              <li class="col" v-for="item in page" :key="item.id" :name="item.id" >
                  <artist :artist-id=item.id :artist=item></artist>
              </li>
          </transition-group>
          <pagination for="artists" :records="records" :vuex="true"></pagination>
        </div>
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
    watch: {
      type() {
        this.$store.dispatch('artists/sortBy', this.type)
      }
    },
    asyncComputed: {
      async page() {
        return this.$store.dispatch('artists/loadSlice', this.$store.getters['artists/slice'])
      }
    },
    computed: {
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
