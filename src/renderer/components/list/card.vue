<template>
  <router-link :to="detailLink"
               class="card card__overview">
    <div class="card-img">
      <img class="card-img-top"
           v-lazyload
           :alt="title"
           :src=defaultCover
           :data-src=cover
           :data-err=defaultCover
      />
      <ul class="action-sheet" v-if="loaded">
        <li v-for="actionButton in buttons" :key="actionButton.name">
          <component :is="actionButton.component" v-bind="dataObject"></component>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <div class="progress" v-if="!loaded">
        <div class="progress-bar progress-bar-indeterminate bg-dark" role="progressbar"></div>
      </div>
      <div class="card-block" v-else>
        <h4 class="card-title">{{title}}</h4>
        <h6 class="card-subtitle" v-if="'string' === typeof subtitle">{{subtitle}}</h6>
        <h6 class="card-subtitle" v-else><i class="material-icons">{{subtitle.icon}}</i>{{ subtitle.text }}</h6>
      </div>
    </div>
  </router-link>
</template>

<script>
  import config from '@/config/index'

  export default {
    props: ['loaded', 'detailLink', 'cover', 'title', 'subtitle', 'buttons', 'dataObject'],
    data() {
      return {
        openSheet: false,
        defaultCover: config.defaultCover
      }
    },
    beforeDestroy() {
      delete this.openSheet
    },
    methods: {
      toggleSheet() {
        this.openSheet = !this.openSheet
      }
    }
  }
</script>
<style>
  .md-card .md-card-media img {
    height: auto;
  }
</style>
