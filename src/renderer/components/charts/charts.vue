<template>
    <article class="charts">
        <div class="album-backdrop no-image">
            <div class="info-bar album media">
                <!--<img class="info-bar-image" :src="cover"/>-->
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1 class="album-name">Donuts and Pies!</h1>
                    </div>
                </div>
            </div>
        </div>
        <ul class="nav nav-tabs active" id="searchTabs" role="tablist">
            <li class="nav-item">
                <a class="nav-link active"
                   id="artists-tab"
                   data-toggle="tab"
                   href="#artists"
                   role="tab"
                   aria-controls="artists">
                    Artists</a>
            </li>
            <li class="nav-item">
                <a class="nav-link"
                   id="albums-tab"
                   data-toggle="tab"
                   href="#albums"
                   role="tab"
                   aria-controls="albums"
                   aria-expanded="true">
                    Albums
                </a>
            </li>
            <!--<li class="nav-item">-->
                <!--<a class="nav-link"-->
                   <!--id="songs-tab"-->
                   <!--data-toggle="tab"-->
                   <!--href="#songs"-->
                   <!--role="tab"-->
                   <!--aria-controls="songs"-->
                   <!--aria-expanded="true">-->
                    <!--Songs-->
                <!--</a>-->
            <!--</li>-->
        </ul>
        <div class="tab-content" id="searchTabsContent">
            <div class="tab-pane fade show active" id="artists" role="tabpanel" aria-labelledby="artists-tab">
                <artists></artists>
            </div>
            <div class="tab-pane fade" id="albums" role="tabpanel" aria-labelledby="albums-tab">
                <albums></albums>
            </div>
            <!--<div class="tab-pane fade" id="songs" role="tabpanel" aria-labelledby="songs-tab">-->

            <!--</div>-->
        </div>
    </article>
</template>

<script>
  import albums from './albums'
import artists from './artists'

export default {
    name: 'charts',
    components: {
      albums,
      artists
    }
  }
</script>

<style>
</style>
