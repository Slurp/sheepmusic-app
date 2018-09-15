<template>
    <div class="loading-overlay show">
        <div id="bars">
            <div class="bar">C</div>
            <div class="bar">o</div>
            <div class="bar">u</div>
            <div class="bar">n</div>
            <div class="bar">t</div>
            <div class="bar">i</div>
            <div class="bar">n</div>
            <div class="bar">g</div>
            <div class="bar"></div>
            <div class="bar">S</div>
            <div class="bar">h</div>
            <div class="bar">e</div>
            <div class="bar">e</div>
            <div class="bar">p</div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      show: false
    }
  }
}
</script>
<style lang="scss">
    .loading-overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    #bars {
        display: flex;
        flex-direction: column;
    }
    .bar {
        display: flex;
        align-items: flex-end;
        justify-content: center;
    }
</style>
