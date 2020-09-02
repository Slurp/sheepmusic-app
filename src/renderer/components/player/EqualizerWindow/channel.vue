<template>
  <div class="channelstrip">
    <div class="label"  v-bind:style="{ color: color }">
      {{label}}
    </div>
    <div class="horizontal-meter">
        <div class="activity" ref="meter"></div>
        <button v-bind:class="{'active': mute === true}" v-on:click="toggleMute"> Mute </button>
        <button class="solo" v-bind:class="{'active': solo === true}" v-on:click="toggleSolo">Solo</button>
    </div>
    <fader :store="store"  :slider="label" :startValue="this.value"/>
  </div>
</template>
<script>
  import Fader from '@/components/player/EqualizerWindow/fader'
  export default {
    name: 'channel',
    components: { Fader },
    data() {
      return {
        lastPeak: 0,
        amplitude: 100,
        lastValue: 50
      }
    },
    props: {
      color: { default: '#ffffff' },
      label: {},
      value: { default: 0 },
      mute: { type: Boolean },
      solo: { type: Boolean },
      store: {}
    },
    ready() {
      window.setInterval(() => {
        if (Math.ceil(this.amplitude) >= this.lastPeak) {
          this.lastPeak = 0
        }
        this.amplitude += (this.lastPeak - this.amplitude) * 0.5
        this.$refs.meter.style.webkitClipPath = 'inset(0 ' + (100 - this.amplitude) + '% 0 0)'
      }, 30)

      window.setInterval(() => {
        this.lastPeak = (Math.random() * (100))
        this.lastValue = (Math.random() * (100))
      }, (Math.random() * (400 - 100)) + 100)
    },
    computed: {
      percentage() {
        const p = this.value * 100
        return 100 - p
      }
    },
    methods: {
      toggleMute() {
        this.mute = !this.mute
      },
      toggleSolo() {
        this.solo = !this.solo
      }
    }
  }
</script>
<style lang="scss" scoped>
  .channelstrip {
    user-select: none;

    background: rgb(50, 50, 50);
    box-shadow: 0 0 0 2px rgba(100, 100, 100, 1);
    border-radius: 4px;
    padding: .25rem;
    margin: .25rem;
    width: 4rem;
    min-height: 30rem;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: stretch;

    .label {
      font-family: 'VT323';
      font-size: .75rem;
      text-transform: uppercase;
      display: block;
      background: #122;
      border-radius: 1px;
      box-shadow: 0 0 10px 5px rgba(255, 255, 255, .05),
      0 3px 10px 5px rgba(0, 0, 0, .8) inset,
      0 5px 10px 5px rgba(20, 30, 40, .5) inset,
      0 0 0 1px rgba(0, 0, 0, .75);
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-shadow: 0 0 20px rgba(200, 255, 200, .75);
      color: rgba(0, 0, 0, .8);
      text-align: center;
      padding: 0 .5rem;
      position: relative;
      overflow: hidden;

      &:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        background: linear-gradient(-10deg,
            transparent 10%,
            rgba(255, 255, 255, .1) 60%,
            transparent 62%,
            transparent
        );

      }
    }
    button {
      text-transform: uppercase;
      border-radius: 5rem;
      background: linear-gradient(180deg,
          rgb(255,255,255) 0%,
          rgb(200,200,200) 5%,
          rgb(150,150,150) 20%,
          rgb(180,180,180) 95%
      );
      box-shadow:
          0 -3px 1px 0 rgba(0,0,0,.5) inset,
          0 0 1px 2px rgba(255,255,255,.5) inset,
          0 2px 10px 0 rgba(0,0,0,.125);
      border: none;
      font-size: .75rem;
      height: 30px;
      color: black;
      font-weight: bold;
      text-shadow: 0 1px 0 rgba(255,255,255,.75);
      padding: 0;
      &:focus {
        outline: none;
      }

      &:active {
        height: 28px;
        margin-top: 2px;
        background: linear-gradient(0deg,
            rgb(255,255,255) 0%,
            rgb(200,200,200) 5%,
            rgb(150,150,150) 20%,
            rgb(180,180,180) 95%
        );
        box-shadow:
            0 -2px 1px 0 rgba(0,0,0,.5) inset,
            0 0 1px 2px rgba(255,255,255,.5) inset,
            0 2px 10px 0 rgba(0,0,0,.125);
        padding-top: 2px;
      }

      &.active {
        background: linear-gradient(0deg,
            rgb(255,80,80) 5%,
            rgb(240,10,10) 95%,
            rgb(200,100,100) 100%
        );
        box-shadow:
            0 -3px 1px 0 rgba(0,0,0,.5) inset,
            0 0 1px 2px rgba(255,255,255,.25) inset,
            0 2px 10px 0 rgba(0,0,0,.125),
            0 0 10px 0 rgba(255,0,0,1);
        text-shadow:
            0 1px 0 rgba(255,255,255,.2),
            0 0 20px rgba(255,200,100,1);

      }
    }

    button.solo {
      &:active {
        height: 28px;
        margin-top: 2px;
        background: linear-gradient(0deg,
            rgb(255,255,255) 0%,
            rgb(200,200,200) 5%,
            rgb(180,180,180) 95%
        );
        box-shadow:
            0 -2px 1px 0 rgba(0,0,0,.5) inset,
            0 0 1px 2px rgba(255,255,255,.5) inset,
            0 2px 10px 0 rgba(0,0,0,.5);
        padding-top: 2px;
      }

      &.active {
        background: linear-gradient(0deg,
            rgb(80,200,255) 5%,
            rgb(10,80,240) 95%,
            rgb(100,150,200) 100%
        );
        box-shadow:
            0 -3px 1px 0 rgba(0,0,0,.5) inset,
            0 0 1px 2px rgba(255,255,255,.25) inset,
            0 2px 10px 0 rgba(0,0,0,.5),
            0 0 10px 0 rgba(0,200,255,1);
        text-shadow:
            0 1px 0 rgba(255,255,255,.2),
            0 0 20px rgba(0,200,255,1);

      }
    }

    button {
      position: relative;
      top: .5rem;
      margin-bottom: .5rem;
    }
  }
</style>
