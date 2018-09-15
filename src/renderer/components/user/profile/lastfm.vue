<template>
    <section class="user-profile__lastfm">
        <div class="card">
            <ul class="list-group list-group-flush" v-if="lastfm.user_name">
                <li class="list-group-item"><strong>Username:</strong>{{ lastfm.user_name }}</li>
                <li class="list-group-item"><strong>Token:</strong>{{ lastfm.token }}</li>
            </ul>
            <div class="card-actions">
                <a href="#" class="btn btn-secondary btn-sm" v-on:click.stop.prevent="disconnectLastFm"
                   v-if="lastfm.isConnected">
                    Disconnect
                </a>
                <a class="btn btn-secondary btn-sm"
                   v-if="lastFmUrl && lastfm.token"
                   href="#"
                   target="_blank"
                   v-on:click.stop.prevent="getTokenLastFm(true)"
                >
                    Step 1: Refresh token
                </a>
                <a class="btn btn-secondary btn-sm"
                   :href="lastFmUrl"
                   v-if="lastFmUrl"
                   target="_blank">
                    Step 2: Validate Token
                </a>
                <a class="btn btn-secondary btn-sm"
                   :href="lastFmUrl"
                   v-if="lastfm.token && lastfm.isConnected == false"
                   v-on:click.stop.prevent="connectLastFm(true)">
                    Step 3:Connect LastFm
                </a>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: 'user-profile-lastfm',
  props: ['lastfm'],
  data() {
    return {
      lastFmAuth: null,
      lastFmUrl: null
    }
  },
  created() {
    if (this.lastfm.isConnected === false) {
      this.getTokenLastFm(false)
    }
  },
  methods: {
    getTokenLastFm(refresh) {
      const url = `/api/lastfm/token/${refresh}`
      this.axios.get(url).then(response => {
        this.lastFmAuth = response.data
        this.lastFmUrl = `http://www.last.fm/api/auth/?api_key=${this.lastFmAuth.key}&token=${this.lastFmAuth.lastfm_token}`
        this.lastfm.token = this.lastFmAuth.lastfm_token
      }).catch(() => {})
    },
    connectLastFm() {
      const url = '/api/lastfm/connect'
      this.axios.get(url).then(response => {
        this.lastfm.isConnected = response.data.connected
      })
    },
    disconnectLastFm() {
      const url = `/api/lastfm/disconnect/${this.lastfm.token}`
      this.axios.get(url).then(() => {
        this.lastfm.isConnected = false
      })
    }
  }
}
</script>

<style>
</style>
