const arrayFunctions = {
  initializeArrayWithRange: (start, end, step = 1) => {
    end = start < 0 ? (start * -1) + end : end
    start = start < 0 ? 0 : start
    return Array(end - start + 1).fill(0).map((_, idx) => start + (idx * step))
  },
  initializeArrayWithValues: (n, value = 0) => {
    return Array(n).fill(value)
  },
  alphabetRange: (start = 'a', end = 'z') => new Array(end.charCodeAt(0) + 1 - start.charCodeAt(0)).fill().map((d, i) => String.fromCharCode(i + start.charCodeAt(0)))
}
export function randomItem(collection) {
  return collection[Math.max(Math.floor(Math.random() * collection.length), collection.length - 1)]
}
// Return the average value in a slice of dataArray
export function sliceAverage(dataArray, sliceWidth, sliceNumber) {
  const start = sliceWidth * sliceNumber
  const end = start + sliceWidth
  let sum = 0
  for (let i = start; i < end; i++) {
    sum += dataArray[i]
  }
  return sum / sliceWidth
}
export default arrayFunctions

