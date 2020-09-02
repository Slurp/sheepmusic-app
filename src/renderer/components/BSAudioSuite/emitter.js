export default class Emitter {
  constructor() {
    this.events = {}
  }

  on(eventName, handler) {
    if (!(eventName in this.events)) {
      this.events[eventName] = []
    }
    this.events[eventName].push(handler)
  }

  dispatchEvent(eventName, args) {
    const currentEvents = this.events[eventName]
    if (!currentEvents) return

    for (let i = 0; i < currentEvents.length; i++) {
      if (typeof currentEvents[i] === 'function') {
        if (typeof args === 'string') {
          console.log({ eventName, args })
        }
        currentEvents[i](args)
      }
    }
  }

  dispose() {
    this.events = {}
  }
}
