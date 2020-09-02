
export const BANDS = [
  60,
  170,
  310,
  600,
  1000,
  3000,
  6000,
  12000,
  14000,
  16000
]

export const LOAD_STYLE = {
  BUFFER: 'BUFFER',
  PLAY: 'PLAY',
  NONE: 'NONE'
}

export const MEDIA_TAG_REQUEST_STATUS = {
  INITIALIZED: 'INITIALIZED',
  FAILED: 'FAILED',
  COMPLETE: 'COMPLETE',
  NOT_REQUESTED: 'NOT_REQUESTED'
}

export const VISUALIZERS = {
  OSCILLOSCOPE: 'OSCILLOSCOPE',
  BAR: 'BAR',
  NONE: 'NONE',
  MILKDROP: 'MILKDROP'
}

export const VISUALIZER_ORDER = [
  VISUALIZERS.BAR,
  VISUALIZERS.OSCILLOSCOPE, // TODO: Verify the order
  VISUALIZERS.NONE
]

export const TIME_MODE = {
  ELAPSED: 'ELAPSED',
  REMAINING: 'REMAINING'
}

export const MEDIA_STATUS = {
  PLAYING: 'PLAYING',
  STOPPED: 'STOPPED',
  PAUSED: 'PAUSED'
}
