<template>
    <div class="artist-bio" v-if="text">
        <div class="artist-bio__short" v-bind:class="{ visible: !show}">{{truncate(text)}}</div>
        <div class="artist-bio__long" v-bind:class="{ visible: show}" v-html="text"></div>
        <a v-if="text.length >= length && !show" @click="toggle()">{{clamp || 'Read More'}}</a>
        <a @click="toggle()" v-if="text.length >= length && show">{{less || 'Show Less'}}</a>
    </div>
</template>

<script>
export default {

  name: 'truncate',
  props: {
    text: String, clamp: String, length: Number, less: String
  },
  methods: {
    truncate(string) {
      if (string) {
        return string.toString().substring(0, this.length || 100)
      }

      return ''
    },
    toggle() {
      this.show = !this.show
    }
  },

  data() {
    return {
      show: false,
      counter: this.length
    }
  }
}
</script>

<style lang="css" scoped>
    a {
        cursor: pointer;
    }
</style>
