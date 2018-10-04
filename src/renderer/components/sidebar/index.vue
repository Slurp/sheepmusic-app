<template>
    <div class="nav-drawer-nav">
        <nav>
            <ul>
                <li>
                    <router-link :to="{name:'recent-albums'}">
                        <i class="material-icons">album</i><span>Albums</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name:'all-artists'}">
                        <i class="material-icons">recent_actors</i><span>Artists</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name:'all-playlists'}">
                        <i class="material-icons">queue_music</i><span>Playlists</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name:'all-genres'}">
                        <i class="material-icons">receipt</i><span>Genres</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name:'user_profile'}">
                        <i class="material-icons">settings</i><span>You</span>
                    </router-link>
                </li>
                <li>
                    <router-link :to="{name:'charts'}">
                        <i class="material-icons">show_chart</i><span>Donuts and Pies!</span>
                    </router-link>
                </li>


            </ul>
        </nav>
    </div>

</template>
<script>
  export default {}
</script>
