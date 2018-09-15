<template>
    <div class="stats">
        <div class="stats__data">
            <h3></h3>
            <ul>
                <li><strong>Total artists:</strong>{{ totalArtists }}</li>
            </ul>
        </div>
        <div class="stats__charts">
            <bar :chart-data="datacollection"></bar>
        </div>
    </div>

</template>
<script>
  import bar from './charts/bar'

export default {
    components: {
      bar
    },
    computed: {
      datacollection() {
        return {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Imported',
              data: this.$store.getters['artists/getImportedByMonth'],
              borderColor: '#455A64',
              backgroundColor: 'transparent',
              type: 'line',
              steppedLine: 'before'
            },
            {
              label: 'Updated',
              backgroundColor: '#f50057',
              data: this.$store.getters['artists/getUpdatedByMonth']
            }

          ]
        }
      },
      totalArtists() {
        return this.$store.getters['artists/totalArtists']
      }
    }
  }
</script>
