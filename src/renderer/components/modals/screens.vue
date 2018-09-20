<template>
    <section class="modals-screens">
        <playlist-form></playlist-form>
        <external></external>
    </section>
</template>
<script>
  import playlistForm from '@/components/playlist/edit'
import external from './external'

export default {
    name: 'modal-screens',
    components: {
      playlistForm,
      external
    }
  }
</script>
