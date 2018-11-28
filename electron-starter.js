// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu, globalShortcut } = require('electron')
const path = require('path')
const url = require('url')
const Store = require('electron-store')

global.store = new Store({name: 'data'})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray
const iconPath = path.join(__dirname, '/src/icon.png')

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    fullscreen: true,
    icon: iconPath,
  })

  // and load the app.
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/build/index.html'),
    protocol: 'file:',
    slashes: true
  })
  mainWindow.loadURL(startUrl)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function createTray() {
  tray = new Tray(iconPath)
  tray.setToolTip('Enote')
  var contextMenu = Menu.buildFromTemplate([
    { label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:',
      click: () => app.quit()
    },
  ]);
  tray.setToolTip('Eddie\'s sticky note app');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    toggleVisible()
  })
}

function toggleVisible() {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

app.disableHardwareAcceleration()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => setTimeout(() => {
  createWindow()
  createTray()

  globalShortcut.register('Super+Space', () => {
    toggleVisible()
  })
}, 100))

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
