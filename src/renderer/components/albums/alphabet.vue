<template>
    <section class="overview-list">
        <ul class="pagination alphabet-pagination">
            <li class="page-item" v-for="letter in this.alphabet"  v-bind:class="{ active: isActive(letter) }">
                <a class="page-link" v-on:click.stop.prevent="selectLetter(letter)"> {{ letter }}</a>
            </li>
        </ul>
        <ul class="list">
            <li class="col" v-for="item in list" :key="item.id" :name="item.id">
                <album :album-id=item.id :album=item :key="item.id"></album>
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
  import album from './album'
  import Toaster from '@/services/toast'
  import loading from '@/components/misc/loading-bars'
  import InfiniteLoading from 'vue-infinite-loading'

export default {
    props: {
      type: {
        type: String,
        required: false,
        default: 'name'
      }
    },
    components: {
      album,
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
        this.$store.dispatch('albums/loadSlice', this.pageSlice()).then(() => {
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
        return this.$store.getters['albums/getByLetter'](this.letter).slice(start, start + 20)
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
        return this.$store.getters['albums/getByLetter'](this.selectedLetter)
      },
      selectedLetter() {
        return this.letter
      }
    }
  }
</script>
<style>
    .infinite-loading-container {
        position: relative;
        top: auto;
        width: 100%;
        left: 0;
        right: 0;
        height: 70px;
        bottom: 30px;
    }
</style>
