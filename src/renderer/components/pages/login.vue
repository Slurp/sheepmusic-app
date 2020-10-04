<template>
    <div class="login">
        <div class="card">
            <div class="card-header">
                <span class="brand-logo">
                </span>
                <h1>Login</h1>
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
                        <button type="submit" class="btn btn-secondary float-md-right">Login</button>
                    </div>
                    <div v-show="error" style="color:red; word-wrap:break-word;">{{ error }}</div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      context: 'login context',

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

  mounted() {
  // Can set query parameter here for auth redirect or just do it silently in login redirect.

  },

  methods: {
    login() {
      this.$store.dispatch('toggleLoading')
      this.$auth.login({
          data:       this.data.body, // Axios
          rememberMe: this.data.rememberMe,
          redirect:   { name: 'recent-albums' },
          fetchUser:  this.data.fetchUser,
      })
        .then(() => {
          this.$store.dispatch('loggedIn').then(() => {
            this.$store.dispatch('toggleLoading')
          }).catch((e) => {
            console.log(e)
          })
        }, () => {
          this.$store.dispatch('toggleLoading')
        })

    }
  }
}
</script>
