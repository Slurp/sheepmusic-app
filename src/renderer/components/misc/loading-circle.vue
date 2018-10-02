<template>
    <div class="loading-screen">
        <div class="loading-screen-surface">
            <div class="progress-circular progress-circular-secondary">
                <div class="progress-circular-wrapper">
                    <div class="progress-circular-inner">
                        <div class="progress-circular-left">
                            <div class="progress-circular-spinner"></div>
                        </div>
                        <div class="progress-circular-gap"></div>
                        <div class="progress-circular-right">
                            <div class="progress-circular-spinner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'loading-circle'
  }
</script>
<style lang="scss">
    .loading-screen {
        display: flex;
        min-width: 100%;
        min-height: 20vh;
        position: relative;
        align-items: center;
        justify-items: center;
        .loading-screen-surface {
            flex:1 100%;
            .progress-circular {
                margin: 0 auto;
            }
        }
    }
</style>
