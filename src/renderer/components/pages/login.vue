<template>
    <div class="login">
        <div class="alert alert-danger" v-if="failed">
            Login failed
        </div>
        <div class="card">
            <div class="card-header">
                <h1 class="h4">Login</h1>
                <span class="brand-logo">
                </span>
            </div>
            <div class="card-body">
                <form v-on:submit.prevent="login()">
                    <div class="form-group">
                        <label class="col-form-label">Username:</label>
                        <input v-model="data.body.username" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <label class="col-form-label">Password:</label>
                        <input v-model="data.body.password" type="password" class="form-control"/>
                    </div>
                    <div class="form-group">
                        <div class="custom-control custom-checkbox">
                            <input v-model="data.rememberMe" id="rememberMe" type="checkbox" class="custom-control-input">
                            <label class="custom-control-label" for="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-secondary float-md-right" v-if="logginIn === false">Login</button>
                        <loading v-else></loading>
                    </div>
                    <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import loading from '@/components/misc/loading-bars'

export default {
  data() {
    return {
      context: 'login context',
      failed: false,
      data: {
        body: {
          username: '',
          password: ''
        },
        rememberMe: true,
        fetchUser: false
      },

      error: null
    }
  },
  components: {
    loading
  },
  computed: {
    logginIn()
    {
        return this.$store.getters.loading
    },
  },
  methods: {
    login() {
      this.failed = true;
      this.$store.dispatch('toggleLogin')
      this.$auth.login({
          data:       this.data.body, // Axios
          rememberMe: this.data.rememberMe,
          redirect:   { name: 'recent-albums' },
          fetchUser:  this.data.fetchUser,
      })
        .then(() => {
          this.$store.dispatch('toggleLoading')
          this.$store.dispatch('loggedIn').then(() => {
            this.$store.dispatch('toggleLoading')
          }).catch((e) => {
            console.log(e)
          })
        }, () => {
          this.failed = true;
        }).finally(() => this.$store.dispatch('toggleLogin'))

    }
  }
}
</script>
