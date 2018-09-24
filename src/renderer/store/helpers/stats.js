function getByMonth(collection, key) {
  if (collection.length > 0) {
    const year = (new Date()).getFullYear()
    const groups = collection.reduce((r, o) => {
      const date = new Date(o[key])
      const m = date.getMonth()
      if (year === date.getFullYear()) {
        // eslint-disable-next-line no-unused-expressions
        (r[m]) ? r[m]++ : r[m] = 1
      }
      return r
    }, Array(12).fill(0))
    for (let i = 1; i < 12; i++) {
      groups[i] += groups[i - 1]
    }
    return groups
  }
  return Array(12).fill(0)
}
export function getImportedByMonth(collection) {
  return getByMonth(collection, 'createdAt')
}
export function getUpdatedByMonth(collection) {
  return getByMonth(collection, 'updatedAt')
}
