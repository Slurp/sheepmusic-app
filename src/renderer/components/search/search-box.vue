<template>
    <form class="form-inline ml-auto form-search" v-on:submit.prevent="search()">
        <input class="form-control" name="query" type="text" v-model="query" placeholder="Search">
        <button class="btn btn-sm" type="submit">Search</button>
    </form>
</template>

<script>
export default {
  name: 'search',
  data() {
    return {
      query: null,
      error: null
    }
  },
  methods: {
    search() {
      this.$router.push({ name: 'search_results', params: { query: this.query } })
    }
  }
}
</script>
