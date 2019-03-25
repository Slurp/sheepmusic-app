<template>
    <section class="overview-list">
        <loading v-if="$asyncComputed.page.updating"></loading>
        <div v-else>
            <transition-group name="list" tag="ul" class="list">
                <li class="col" v-for="item in page" :key="item.id" :name="item.id">
                    <album :album-id=item.id :album=item :key="item.id"></album>
                </li>
            </transition-group>
            <pagination for="albums" :records="records" :vuex="true"></pagination>
        </div>
    </section>
</template>

<script>
  import LoadingBars from '@/components/misc/loading-bars'
  import album from './album'
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
    created() {
      this.$store.dispatch('albums/sortBy', this.type)
    },
    watch: {
      type() {
        this.$store.dispatch('albums/sortBy', this.type)
      }
    },
    asyncComputed: {
      async page() {
        return this.$store.dispatch('albums/loadSlice', this.$store.getters['albums/slice'])
      }
    },
    computed: {
      records() {
        return this.$store.getters['albums/totals']
      }
    }
  }
</script>
