
export default {
  appTitle: 'SheepMusic',
  baseUrl: (process.env.NODE_ENV === 'production') ? 'http://music.zwartschaap.net' : 'http://music.zwartschaap.net.develop',
  defaultCover: require('../assets/media/general/default.png')
}
