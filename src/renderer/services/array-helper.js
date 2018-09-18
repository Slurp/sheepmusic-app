const arrayFunctions = {
  initializeArrayWithRange: (end, start = 0) => {
    Array.from({ length: (end + 1) - start }).map((v, i) => i + start)
  },
  initializeArrayWithValues: (n, value = 0) => {
    Array(n).fill(value)
  },
  alphabetRange: (start = 'a', end = 'z') => new Array(end.charCodeAt(0) + 1 - start.charCodeAt(0)).fill().map((d, i) => String.fromCharCode(i + start.charCodeAt(0)))
}
export function randomItem(collection) {
  return collection[Math.max(Math.floor(Math.random() * collection.length), collection.length - 1)]
}
export default arrayFunctions

