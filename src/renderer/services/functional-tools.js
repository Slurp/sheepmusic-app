export const maybe = (voidable, action, fail = null) => {
  // noinspection ES6ModulesDependencies
  if (voidable === undefined || voidable === null) {
    return fail
  }

  return action(voidable)
}

export const toPercent = (min, max, value) =>
  (value - min) / (max - min)

export const percentToRange = (percent, min, max) =>
  min + Math.round(percent * (max - min))

export const percentToIndex = (percent, length) =>
  percentToRange(percent, 0, length - 1)
