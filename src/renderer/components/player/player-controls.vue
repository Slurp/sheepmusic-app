<template>
  <div class='player-controls'>
    <div class='row'>
      <prev-song-btn/>
      <rewind-btn/>
      <playpause-btn/>
      <forward-btn/>
      <next-song-btn/>
    </div>
  </div>
</template>
<script>
  import ForwardBtn from 'components/player/Controls/forwardBtn'
  import NextSongBtn from 'components/player/Controls/nextBtn'
  import PlaypauseBtn from 'components/player/Controls/playpauseBtn'
  import PrevSongBtn from 'components/player/Controls/prevBtn'
  import RewindBtn from 'components/player/Controls/rewindBtn'

  export default {
    name: 'controls',
    components: { NextSongBtn, ForwardBtn, PlaypauseBtn, RewindBtn, PrevSongBtn }
  }
</script>
