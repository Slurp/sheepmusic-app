<template>
    <div class='player-controls'>
        <div class='row'>
            <button type='button' class="player__button" v-on:click.stop.prevent="$emit('playPrev')">
                <i class='material-icons'>skip_previous</i>
                <span class='plyr__sr-only'>previous</span>
            </button>
            <button type='button' class="player__button player__rewind" v-on:click.stop.prevent="$emit('rewind')">
                <i class='material-icons'>fast_rewind</i>
                <span class='plyr__sr-only'>Rewind {seektime} secs</span>
            </button>
            <button type='button' class="player__button player__button__center" data-plyr='play' v-if="stopped"
                    v-on:click.stop.prevent="$emit('play')">
                <i class='material-icons'>play_circle_outline</i>
                <span class='plyr__sr-only'>Play</span>
            </button>
            <button type='button' class="player__button player__button__center" v-if="playing"
                    v-on:click.stop.prevent="$emit('pause')">
                <i class='material-icons'>pause_circle_outline</i>
                <span class='plyr__sr-only'>Pause</span>
            </button>
            <button type='button' class="player__button player__forward" v-on:click.stop.prevent="$emit('forward')">
                <i class='material-icons'>fast_forward</i>
                <span class='plyr__sr-only'>Forward {seektime} secs</span>
            </button>
            <button type='button' class="player__button" v-on:click.stop.prevent="$emit('playNext')">
                <i class='material-icons'>skip_next</i>
                <span class='plyr__sr-only'>next</span>
            </button>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'volume',
    props: {
      playing: {
        type: Boolean,
        default: false
      },
      stopped: {
        type: Boolean,
        default: true
      }
    }
  }
</script>
