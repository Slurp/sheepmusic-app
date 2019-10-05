import { app, BrowserWindow } from 'electron' // eslint-disable-line
import windowStateKeeper from 'electron-window-state'
import path from 'path'

const MIN_WINDOW_WIDTH = 320
const MIN_WINDOW_HEIGHT = 640

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
  /**
   * Window State
   * @type {{x: *, y: *, width: *, height: *, isMaximized: *, isFullScreen: *, saveState, unmanage, manage}}
   */
  const mainWindowState = windowStateKeeper({
    defaultWith: MIN_WINDOW_WIDTH,
    defaultHeight: MIN_WINDOW_HEIGHT
  })
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width < MIN_WINDOW_WIDTH ? MIN_WINDOW_WIDTH : mainWindowState.width,
    height: mainWindowState.height < MIN_WINDOW_HEIGHT ? MIN_WINDOW_HEIGHT : mainWindowState.height,
    useContentSize: true,
    fullscreenable: false,
    titleBarStyle: 'hiddenInset',
    minHeight: MIN_WINDOW_HEIGHT,
    minWidth: MIN_WINDOW_WIDTH,
    autoHideMenuBar: true,
    darkTheme: true,
    show: false,
    backgroundColor: '#2e2c29',
    webPreferences: {
      nodeIntegration: true // add this
    }
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  if (mainWindowState.isMaximized) {
    mainWindow.maximize()
  }

  mainWindowState.manage(mainWindow)

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
