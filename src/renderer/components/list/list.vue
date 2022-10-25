<template>
  <section class="overview-list">
    <loading v-if="$asyncComputed.page.updating"></loading>
    <div v-else>
      <transition-group name="list" tag="ul" class="list">
        <li class="col" v-for="item in page" :key="item.id" :name="item.id">
         <slot :listitem="item"></slot>
        </li>
      </transition-group>
      <pagination :for="forStore" :records="records" :vuex="true"></pagination>
    </div>
  </section>
</template>

<script>
  import loading from '@/components/misc/loading-bars'

  export default {
    props: {
      forStore: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: false,
        default: 'all'
      }
    },
    components: {
      LoadingBars,
      loading
    },
    created() {
      this.$store.dispatch(`${this.forStore}/sortBy`, this.type)
    },
    watch: {
      type() {
        this.$store.dispatch(`${this.forStore}/sortBy`, this.type)
      }
    },
    asyncComputed: {
      async page() {
        return this.$store.dispatch(`${this.forStore}/loadSlice`, this.$store.getters[`${this.forStore}/slice`])
      }
    },
    computed: {
      records() {
        return this.$store.getters[`${this.forStore}/totals`]
      }
    }
  }
</script>
