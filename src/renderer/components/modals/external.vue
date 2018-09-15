<template>
    <div class="modal" id="externalModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
        <div class="modal-dialog modal modal" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">External</h5>
                </div>
                <div class="modal-body">
                    <div class="content" v-html="content"></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'external-modal',
  data() {
    return {
      content: null
    }
  },
  mounted() {
    if (process.env.IS_WEB) {
      // eslint-disable-next-line no-undef
      $('#externalModal').on('show.bs.modal', event => {
        this.axios.get(event.relatedTarget.getAttribute('href')).then(response => {
          this.content = response.data
        }).catch(() => {
          this.content = 'Nope!'
        })
      })
    }
  }
}
</script>
