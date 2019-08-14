<template>
  <section class="overview-list">
    <ul class="pagination alphabet-pagination">
      <li class="page-item" v-for="letter in this.alphabet"  v-bind:class="{ active: isActive(letter) }">
        <a class="page-link" v-on:click.stop.prevent="selectLetter(letter)"> {{ letter }}</a>
      </li>
    </ul>
    <ul class="list">
      <li class="col" v-for="item in list" :key="item.id" :name="item.id">
        <slot :listitem="item"></slot>
      </li>
    </ul>
    <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading" class="infinity">
            <span slot="no-more">
               End of the tunnel.
            </span>
      <div slot="spinner">
        <loading></loading>
      </div>
    </infinite-loading>
  </section>
</template>

<script>
  import arrayFunctions from '@/services/array-helper'
  import Toaster from '@/services/toast'
  import loading from '@/components/misc/loading-bars'
  import InfiniteLoading from 'vue-infinite-loading'

  export default {
    props: {
      forStore: {
        type: String,
        required: true
      }
    },
    components: {
      loading,
      InfiniteLoading
    },
    data() {
      return {
        loadedPage: false,
        toast: new Toaster(),
        alphabet: arrayFunctions.alphabetRange(),
        letter: 'a',
        list: [],
        pageNumber: 1
      }
    },
    beforeDestroy() {
      this.toast = null
      delete this.toast
      delete this.loadedPage
    },
    methods: {
      isActive(letter) {
        return (letter === this.selectedLetter)
      },
      selectLetter(letter) {
        this.letter = letter
        this.loadedPage = false
        this.list = []
        this.pageNumber = 1
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        })
      },
      infiniteHandler($state) {
        this.$store.dispatch(`${this.forStore}/loadSlice`, this.pageSlice()).then(() => {
          this.loadedPage = true
          this.list = this.list.concat(this.pageSlice())
          this.getNextPage()
          $state.loaded()
          if (this.pageSlice().length < 20) {
            $state.complete()
          }
        })
      },
      pageSlice() {
        const start = (20 * (this.pageNumber - 1))
        return this.$store.getters[`${this.forStore}/getByLetter`](this.letter).slice(start, start + 20)
      },
      getNextPage() {
        this.pageNumber++
      }
    },
    computed: {
      page() {
        this.loadedPage = true
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        })
        return this.$store.getters[`${this.forStore}/getByLetter`](this.selectedLetter)
      },
      selectedLetter() {
        return this.letter
      }
    }
  }
</script>
<style scoped style="scss">
  .infinity {
    position: relative;
    top: auto;
    width: 100%;
    left: 0;
    right: 0;
    height: 70px;
    bottom: 30px;
    .loading-screen {
      display: block;
      width: 100%;
      height: 100;
    }
  }
</style>
