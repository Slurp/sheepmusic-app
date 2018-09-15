<template>
    <div class="stats">
        <div class="stats__data">
            <ul>
                <li><strong>Total Albums:</strong>{{ totalAlbums }}</li>
            </ul>
        </div>
        <div class="stats__charts">
            <bar :chart-data="datacollection"></bar>
            <pie :chart-data="losslessCollection"></pie>
        </div>
    </div>

</template>
<script>
  import bar from './charts/bar'
import pie from './charts/pie'

export default {
    components: {
      bar,
      pie
    },
    computed: {
      datacollection() {
        return {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Imported',
              data: this.$store.getters['albums/getImportedByMonth'],
              borderColor: '#455A64',
              backgroundColor: 'transparent',
              type: 'line',
              steppedLine: 'before'
            }
          ]
        }
      },
      losslessCollection() {
        return {
          labels: ['Lossless', 'lossy'],
          datasets: [
            {
              label: 'What HD?',
              data: this.$store.getters['albums/getLosslessCollection'],
              backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)']
            }
          ]
        }
      },
      totalAlbums() {
        return this.$store.getters['albums/totalAlbums']
      }
    }
  }
</script>
