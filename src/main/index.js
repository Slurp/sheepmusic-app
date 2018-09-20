import { app, protocol, BrowserWindow } from 'electron' // eslint-disable-line
import path from 'path'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  'http://localhost:9080' :
  `file://${__dirname}/index.html`

function createWindow() {
  protocol.registerFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: path.normalize(`http://${__dirname}/${url}`) })
  }, error => {
    if (error) console.error('Failed to register protocol')
  })
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    titleBarStyle: 'hiddenInset',
    minWidth: 320,
    minHeight: 640,
    backgroundColor: '#2e2c29'
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
