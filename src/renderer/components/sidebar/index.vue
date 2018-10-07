<template>
    <nav class="nav-drawer-nav">
        <ul class="drawer-items">
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'recent-albums'}">
                    <i class="drawer-link_icon material-icons">album</i>
                    <span class="drawer-link_text">Albums</span>
                </router-link>
            </li>
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'all-artists'}">
                    <i class="drawer-link_icon material-icons">recent_actors</i>
                    <span class="drawer-link_text">Artists</span>
                </router-link>
            </li>
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'all-playlists'}">
                    <i class="drawer-link_icon material-icons">queue_music</i>
                    <span class="drawer-link_text">Playlists</span>
                </router-link>
            </li>
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'all-genres'}">
                    <i class="drawer-link_icon material-icons">receipt</i>
                    <span class="drawer-link_text">Genres</span>
                </router-link>
            </li>
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'user_profile'}">
                    <i class="drawer-link_icon material-icons">settings</i>
                    <span class="drawer-link_text">You</span>
                </router-link>
            </li>
            <li class="drawer-item">
                <router-link class="drawer-link" :to="{name:'charts'}">
                    <i class="drawer-link_icon material-icons">show_chart</i>
                    <span class="drawer-link_text">Donuts and Pies!</span>
                </router-link>
            </li>
        </ul>
    </nav>
</template>
<script>
  export default {}
</script>
