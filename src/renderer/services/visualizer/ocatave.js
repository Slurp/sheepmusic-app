import visualizerConstants from '@/services/visualizer/contants'

export default function octaveBucketsForBufferLength(bufferLength) {
  const octaveBuckets = new Array(visualizerConstants.NUM_BARS).fill(0)
  const minHz = 200
  const maxHz = 22050
  const octaveStep = Math.pow(maxHz / minHz, 1 / visualizerConstants.NUM_BARS)

  octaveBuckets[0] = 0
  octaveBuckets[1] = minHz
  for (let i = 2; i < visualizerConstants.NUM_BARS - 1; i++) {
    octaveBuckets[i] = octaveBuckets[i - 1] * octaveStep
  }
  octaveBuckets[visualizerConstants.NUM_BARS - 1] = maxHz

  for (let i = 0; i < visualizerConstants.NUM_BARS; i++) {
    octaveBuckets[i] = Math.floor((octaveBuckets[i] / maxHz) * bufferLength)
  }

  return octaveBuckets
}
