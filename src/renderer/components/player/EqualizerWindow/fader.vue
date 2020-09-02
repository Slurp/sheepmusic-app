<template>
  <div class="fader">
    <div class="fader-track" ref="track">
      <input type='range' :min='minValue' :max='maxValue' v-model="value" orient="vertical" @change="saveValue"/>
      <div class="fader-track__bar" v-bind:style="{ height: barHeight }"></div>
      <div class="fader-track__thumb" v-bind:style="{ top: thumbPosition }"></div>
      <div class="fader-track__label">{{slider}}</div>
    </div>
    <div class="scale">
      <div class="scale-tick" v-for="p in scalePositions" v-bind:style="{ bottom: p }" :key=p />
    </div>
  </div>
</template>
<script>
  import arrayFunctions from '@/services/array-helper'

  export default {
    name: 'fader',
    data() {
      return {
        value: this.startValue,
        range: arrayFunctions.initializeArrayWithRange(this.minValue, this.maxValue, (100 / (this.maxValue + (this.minValue * -1))))
      }
    },
    props: {
      startValue: { default: 0 },
      slider: { default: " " },
      store: { type: String },
      minValue: { type: Number, default: -20 },
      maxValue: { type: Number, default: 20 }
    },
    computed: {
      thumbPosition() {
        const percentage = ((this.value - this.minValue) * 100) / (this.maxValue - this.minValue)
        return (100 - percentage) + '%'
      },
      barHeight() {
        const percentage = ((this.value - this.minValue) * 100) / (this.maxValue - this.minValue)
        return percentage + '%'
      },
      scalePositions() {
        return this.range.map(value => (value + '%'))
      }
    },
    methods: {
      saveValue() {
        return this.$store.dispatch(`${this.store}/setForSlider`, { slider: this.slider, value: this.value })
      }
    }
  }
</script>
<style lang="scss" scoped>
  $slider-thumb-size: 20px;
  $slider-height: 100%;

  $slider-track-thickness: 4px;
  $slider-width: 100%;
  $color-theme: #3D3D4A;
  $color-track: #343440;
  $color-text: lighten(#737383, 10%);
  $border-radius: 10px;

  @mixin device-bigger {
    @media (min-width: 800px) {
      @content;
    }
  }

  /* The input range mixin code is based on Ana Tudor's pen codepen.io/thebabydino/pen/pvLPOQ */

  @mixin track {
    background: $color-track;
    width: $slider-track-thickness;
    border: none $color-track;
    border-radius: 10px;
    box-shadow: 0 0 0 2px $color-theme;
  }

  @mixin thumb {
    position: relative;
    width: $slider-thumb-size*2;
    height: $slider-thumb-size*2;
    opacity: 0;
  }

  .fader {
    position: relative;
    display: inline-block;

    .fader-track {
      display: inline-block;
      width: $slider-width;
      position: relative;
      height: $slider-height;
      float: left;

      &__label {
        position: absolute;
        bottom: -24px;
        left: calc(50% - 2em);
        font-size: 80%;
        color: $color-text;
        content: "32";
        width: 4em;
        text-align: center;
      }

      &__thumb {
        opacity: 1;
        position: absolute;
        left: 50%;
        margin-left: -$slider-thumb-size/2;
        width: $slider-thumb-size;
        height: $slider-thumb-size * 2;
        margin-top: -$slider-thumb-size;
        line-height: $slider-thumb-size;

        color: #8376FF;
        text-align: center;
        font-size: 40%;
        border-radius: 4px;
        pointer-events: none;
        cursor: pointer;
        z-index: 2;
        background: repeating-linear-gradient(
                0deg,
                transparent,
                transparent 5px,
                rgba(0, 0, 0, 1) 6px
        ),
        linear-gradient(0deg,
                rgb(70, 70, 70) 0%,
                rgb(90, 90, 90) 14%,
                rgb(20, 20, 20) 15%,
                rgb(20, 20, 20) 50%,
                rgb(90, 90, 90) 84%,
                rgb(20, 20, 20) 85%,
                rgb(30, 30, 30) 100%
        );
        box-shadow:
            0 .25rem .5rem 0 rgba(0, 0, 0, .5);

        &:after {
          content: " ";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          margin-top: -1px;
          height: 3px;
          background: rgba(255, 255, 255, .75);
        }
      }

      &__bar {
        left: 50%;
        margin-left: -($slider-track-thickness/2);
        bottom: 0;
        position: absolute;
        background: linear-gradient(#000000, #9791B8);
        pointer-events: none;
        width: $slider-track-thickness;
        border-radius: 10px;
        opacity: 1;
      }

      input[type=range][orient=vertical] {

        position: relative;
        margin: 0;
        height: 100%;
        width: 100%;
        display: inline-block;
        position: relative;
        writing-mode: bt-lr;
        -webkit-appearance: slider-vertical;
        &::-webkit-slider-runnable-track,
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
        }

        &::-webkit-slider-runnable-track {
          @include track;
        }

        &::-moz-range-track {
          @include track;
        }

        &::-ms-track {
          @include track;
          color: transparent;
          height: 100%;
        }

        &::-ms-fill-lower,
        &::-ms-fill-upper,
        &::-ms-tooltip {
          display: none;
        }

        &::-webkit-slider-thumb {
          left: -$slider-thumb-size;
          @include thumb;
        }

        &::-moz-range-thumb {
          @include thumb;
        }

        &::-ms-thumb {
          @include thumb;
        }
      }
    }

    .scale-tick {
      position: absolute;
      left: 50%;
      opacity: .5;

      &:before {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: -($slider-thumb-size / 2  * 1.5);
        width: $slider-thumb-size / 2;
        height: 1px;
        background: rgb(200, 200, 200);
      }

      &:after {
        content: " ";
        display: block;
        position: absolute;
        top: 0;
        left: $slider-thumb-size / 4;
        width: $slider-thumb-size / 2;
        height: 1px;
        background: rgb(200, 200, 200);
      }

      &:last-child:after, &:last-child:before, &:first-child:after, &:first-child:before {
        height: 2px;
      }

      &:nth-child(2), &:nth-child(4) {
        display: none;
      }

    }
  }
</style>
