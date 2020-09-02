<template>
  <div id="equalizer">
    <graph />
    <div class="presets">
      <label class="select-wrapper">
        <select v-model="selectedPresetIndex">
          <option v-for="p in presets" :value="p.id" :key="p.id" v-once>{{ p.name }}</option>
        </select>
      </label>
    </div>
    <div class="bands">
      <Fader class="band preamp" :store="'equalizer'" :slider="'preamp'" :startValue="getSliderValue('preamp')" :key="'preamp'"/>
      <Fader class="band amp" :slider="band" :store="'equalizer'" :startValue="getSliderValue(band)" v-for="band in bands" :key="band"/>
    </div>
  </div>
</template>

<script>
  import { equalizerConstants } from '@/services/equalizer/constants'
  import Fader from '@/components/player/EqualizerWindow/fader'
  import Graph from 'components/player/EqualizerWindow/graph'
  import { cloneDeep, tap } from 'lodash'

  export default {
    name: 'mixer',
    components: { Graph, Fader },
    data: () => ({
      bands: equalizerConstants.bands,
      preampGainValue: 0,
      selectedPresetIndex: -1
    }),
    mounted() {
      this.init()
    },
    watch: {
      selectedPresetIndex(val) {
        if (~~val !== -1) {
          this.loadPreset(this.$store.getters['equalizer/getPresetById'](val))
        }
      }
    },
    computed: {
      sliders() {
        return this.$store.getters['equalizer/getSliders']
      },
      presets() {
        return tap(cloneDeep(this.$store.getters['equalizer/getPresets']), clonedPresets => {
          // Prepend an empty option for instruction purpose.
          clonedPresets.unshift({
            id: -1,
            name: 'Preset'
          })
        })
      }
    },
    methods: {
      init() {
        console.log('init()')
      },

      getSliderValue(band) {
        return this.sliders[band]
      },

      changePreampGain(dbValue) {
        this.preampGainValue = dbValue
        // this.preampGainNode.gain.setTargetAtTime(Math.pow(10, dbValue / 20), context.currentTime, 0.01)
      },

      changeFilterGain: (frequency, value) => {
        console.log({ frequency, value })
      },

      loadPreset(preset) {
        console.log('loadPreset')
        console.log(preset)
        console.log('loadPreset')
        this.$store.dispatch('equalizer/setPreset', preset.id);
      },

      save() {
        this.$store.dispatch('equalizer/set', {
          preamp: this.preampGainValue,
          gains: this.bands.map(band => band.filter.gain.value)
        })
      }
    }
  }
</script>

<style lang="scss">
  $colorHighlight: #FFF;
  $colorMainText: #000;
  #equalizer {
    user-select: none;
    position: absolute;
    bottom: 80px;
    width: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    left: 10px;
    right: 10px;

    label {
      margin-top: 8px;
      margin-bottom: 0;
      text-align: left;
    }

    .presets {
      padding: 8px 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex: 1;
      align-content: center;
      z-index: 1;
      border-bottom: 1px solid rgba(255, 255, 255, .1);


      .select-wrapper {
        position: relative;
        margin-bottom: 0;

        &::after {
          content: '\f107';
          font-family: FontAwesome;
          color: $colorHighlight;
          display: inline-block;
          position: absolute;
          right: 8px;
          top: 6px;
          pointer-events: none;
        }
      }

      select {
        background: none;
        color: $colorMainText;
        padding-left: 0;
        width: 100px;
        text-transform: none;

        option {
          color: #333;
        }
      }
    }
    .bands {
      display: flex;
      flex: 1 1 100%;
      justify-content: stretch;
      align-items: stretch;
      height: 50%;
      margin: 30px;
      .band {
        background: rgb(50, 50, 50);
        box-shadow: 0 0 0 2px rgba(100, 100, 100, 1);
        border-radius: 4px;
        padding: 0;
        margin: 5px;
        width: calc((100% / 12) - 0.5rem);
      }
      .preamp {
        margin-right: auto;
      }
      .channelstrip {

      }
    }
  }
</style>
