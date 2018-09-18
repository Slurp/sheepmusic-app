export const maybe = (voidable, action, fail = null) => {
  // noinspection ES6ModulesDependencies
  if (voidable === undefined || voidable === null) {
    return fail
  }

  return action(voidable)
}
