
import * as Push from 'push.js'
import config from '@/config/index'

export default class Notification {
  static notifySong(song) {
    Push.clear()
    const url = new URL(song.album.cover, config.baseUrl).href
    const promise = Push.create(`♫ ${song.title}`, {
      body: `${song.album.name} – ${song.artist.name}`,
      icon: url,
      timeout: 300,
      silent: true
    })

    promise.then(notification => {
      notification.close()
    })
  }
}
