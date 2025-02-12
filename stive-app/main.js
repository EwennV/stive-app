import { app, BrowserWindow } from 'electron'
import path from 'path'

let win

function createWindow() {
  win = new BrowserWindow({
      webPreferences: {
          //preload: path.join(__dirname, 'preload.cjs'),
          preload: path.join(app.getAppPath(), './preload.cjs'),
      nodeIntegration: true
    }
  })
  win.maximize();
  win.loadFile('dist/index.html')

  // win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
