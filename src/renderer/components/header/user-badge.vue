<template>
    <ul class="navbar-nav mr-auto user-navbar">
        <li class="nav-item dropdown">
            <a class="nav-link nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
               aria-expanded="false">
                <i class="material-icons">
                    account_circle
                </i>
                {{ $auth.user().user }}
            </a>
            <div class="dropdown-menu">
                <a class="dropdown-item" @click.prevent="logout">
                    Leave
                    <i class="material-icons">
                        exit_to_app
                    </i>
                </a>
            </div>
        </li>
    </ul>
</template>

<script>
  export default {
    name: 'user-menu',
    methods: {
      logout() {
        this.$auth.logout({
          makeRequest: false,
          success() {
          },
          error(error) {
            // eslint-disable-next-line no-console
          }
        })
      }
    }
  }
</script>

<style>

</style>
