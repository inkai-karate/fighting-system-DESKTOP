import { app, shell, BrowserWindow, ipcMain, globalShortcut, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { readFileSync } from 'fs'
import nodeChildProcess from 'child_process'
import os from 'os'

let mainWindow: BrowserWindow | null = null
let loginWindow: BrowserWindow | null = null

// Fungsi untuk membersihkan localStorage di semua window
function clearAllLocalStorage(): void {
  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    if (!win.isDestroyed()) {
      win.webContents.executeJavaScript('localStorage.clear()').catch(() => {
        // Ignore errors jika window sudah dihancurkan
      })
    }
  })
  console.log('LocalStorage cleared from all windows')
}

// Fungsi untuk restart aplikasi ke login window
function restartToLogin(): void {
  console.log('Restarting to login window...')
  clearAllLocalStorage()

  const windows = BrowserWindow.getAllWindows()
  windows.forEach((win) => {
    if (win !== loginWindow && !win.isDestroyed()) {
      win.close()
    }
  })

  mainWindow = null

  if (!loginWindow || loginWindow.isDestroyed()) {
    createLoginWindow()
  } else {
    loginWindow.focus()
  }
}

// Fungsi untuk mengecek token di localStorage
async function checkTokenAndRedirect(window: BrowserWindow): Promise<boolean> {
  try {
    const token = await window.webContents.executeJavaScript('localStorage.getItem("token")')
    if (token && token !== 'null' && token !== 'undefined') {
      console.log('Token found, redirecting to main window...')
      if (window === loginWindow) {
        loginWindow?.close()
        loginWindow = null
        createMainWindow()
      }
      return true
    }
    return false
  } catch (error) {
    console.error('Error checking token:', error)
    return false
  }
}

function createLoginWindow(): void {
  if (loginWindow) {
    loginWindow.focus()
    return
  }

  loginWindow = new BrowserWindow({
    width: 450,
    height: 550,
    minWidth: 450,
    minHeight: 550,
    show: false,
    frame: false,
    titleBarStyle: 'hidden',
    resizable: false,
    center: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false
    }
  })

  loginWindow.on('ready-to-show', () => {
    loginWindow?.show()
    loginWindow?.focus()
  })

  // Send window size to renderer when login window is resized
  loginWindow.on('resize', () => {
    if (loginWindow && !loginWindow.isDestroyed()) {
      const bounds = loginWindow.getBounds()
      console.log('Login window resized, sending size', bounds)
      loginWindow.webContents.send('screen-size-changed', {
        width: bounds.width,
        height: bounds.height
      })
    }
  })

  loginWindow.on('closed', () => {
    loginWindow = null
    if (!mainWindow) {
      app.quit()
    }
  })

  loginWindow.webContents.once('did-finish-load', () => {
    checkTokenAndRedirect(loginWindow!)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    loginWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/login')
  } else {
    loginWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/login'
    })
  }
}

function createMainWindow(): void {
  if (mainWindow) {
    mainWindow.focus()
    return
  }

  // Dapatkan ukuran layar primary display
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  console.log(`Creating window with screen size: ${width}x${height}`)

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 750,
    minWidth: 1200,
    minHeight: 750,
    // show: false,
    // frame: false,
    titleBarStyle: 'hidden',
    // fullscreen: true,
    // autoHideMenuBar: true,
    // resizable: false, // Tidak bisa diresize
    // movable: false, // Tidak bisa dipindah
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
    // mainWindow?.setFullScreen(true)
    // mainWindow?.maximize()

    // Kirim ukuran layar ke renderer
    mainWindow?.webContents.send('screen-size-changed', { width, height })
  })

  // Send window size to renderer when main window is resized
  mainWindow.on('resize', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      const bounds = mainWindow.getBounds()
      console.log('Main window resized, sending size', bounds)
      mainWindow.webContents.send('screen-size-changed', {
        width: bounds.width,
        height: bounds.height
      })
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
    if (!loginWindow) {
      createLoginWindow()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.webContents.once('did-finish-load', () => {
    checkTokenAndRedirect(mainWindow!)
    // Kirim ukuran layar setelah load
    const display = screen.getPrimaryDisplay()
    mainWindow?.webContents.send('screen-size-changed', display.workAreaSize)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// IPC handlers untuk semua window
ipcMain.on('window-minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.minimize()
})

ipcMain.on('window-maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window?.isMaximized()) {
    window.unmaximize()
  } else {
    window?.maximize()
  }
})

ipcMain.on('exam-enter-fullscreen', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window && !window.isDestroyed()) {
    window.setFullScreen(true)
    window.setClosable(false)
    window.setAlwaysOnTop(true, 'screen-saver')

    window.webContents.on('before-input-event', (event, input) => {
      if (input.alt || input.meta || input.key === 'Meta' || input.key === 'Alt') {
        event.preventDefault()
      }
      if (input.key === 'F11') {
        event.preventDefault()
      }
      if (input.key === 'Escape') {
        event.preventDefault()
      }
    })

    console.log('Exam mode: Fullscreen enabled')
  }
})

ipcMain.on('exam-exit-fullscreen', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window && !window.isDestroyed()) {
    window.setFullScreen(false)
    window.setClosable(true)
    window.setAlwaysOnTop(false)
    window.webContents.removeAllListeners('before-input-event')
    console.log('Exam mode: Fullscreen disabled')
  }
})

ipcMain.handle('exam-check-fullscreen', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  return window?.isFullScreen() || false
})

ipcMain.on('window-close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  window?.webContents.executeJavaScript('localStorage.clear()')
  window?.close()
})

// Handler untuk manual reload ke login
ipcMain.on('reload-to-login', () => {
  restartToLogin()
})

// Handler untuk login berhasil
ipcMain.on('login-success', () => {
  loginWindow?.close()
  loginWindow = null
  createMainWindow()
})

// Handler untuk logout
ipcMain.on('logout', () => {
  clearAllLocalStorage()
  mainWindow?.close()
  mainWindow = null
  createLoginWindow()
})

// IPC handler untuk cek token dari renderer process
ipcMain.handle('check-token-exists', async () => {
  try {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const token = await windows[0].webContents.executeJavaScript('localStorage.getItem("token")')
      return !!(token && token !== 'null' && token !== 'undefined')
    }
    return false
  } catch (error) {
    console.error('Error checking token:', error)
    return false
  }
})

// IPC handler untuk mendapatkan ukuran layar
ipcMain.handle('get-screen-size', () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  return primaryDisplay.workAreaSize
})

// IPC handler untuk mendapatkan semua display info
ipcMain.handle('get-display-info', () => {
  const displays = screen.getAllDisplays()
  const primaryDisplay = screen.getPrimaryDisplay()

  return {
    primary: primaryDisplay.workAreaSize,
    all: displays.map((d) => ({
      id: d.id,
      bounds: d.bounds,
      workArea: d.workAreaSize,
      scaleFactor: d.scaleFactor
    }))
  }
})

// IPC handlers lainnya
ipcMain.handle('get-my-config', async () => {
  try {
    const jsonPath = is.dev
      ? join(__dirname, '../../resources/assets/config/config.json')
      : join(process.resourcesPath, 'resources/assets/config/config.json')

    const content = readFileSync(jsonPath, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    console.error('Gagal membaca config:', err)
    return null
  }
})

ipcMain.handle('get-assets-path', async () => {
  const assetsPathConfig = is.dev
    ? join(__dirname, '../../resources/assets')
    : join(process.resourcesPath, 'resources/assets')

  return assetsPathConfig
})

ipcMain.on('get-deviceID', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)

  if (!window || window.isDestroyed()) {
    return
  }
  const script = nodeChildProcess.spawn('cmd.exe', ['/c', 'wmic csproduct get uuid'])

  script.stdout.on('data', (data) => {
    event.sender.send('uuid-response', data.toString().trim())
  })

  script.stderr.on('data', (err) => {
    event.sender.send('uuid-response', `Error: ${err.toString().trim()}`)
  })
})

ipcMain.handle('get-device-label', () => {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch()
  }
})

ipcMain.handle('clear-localstorage', async () => {
  clearAllLocalStorage()
})

ipcMain.handle('restart-to-login', async () => {
  restartToLogin()
  return true
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Broadcast screen size when display configuration changes (connect/disconnect/metric changes)
  screen.on('display-metrics-changed', () => {
    const primary = screen.getPrimaryDisplay()
    const size = primary.workAreaSize
    console.log('Display metrics changed, broadcasting size', size)
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) win.webContents.send('screen-size-changed', size)
    })
  })

  screen.on('display-added', () => {
    const primary = screen.getPrimaryDisplay()
    const size = primary.workAreaSize
    console.log('Display added, broadcasting size', size)
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) win.webContents.send('screen-size-changed', size)
    })
  })

  screen.on('display-removed', () => {
    const primary = screen.getPrimaryDisplay()
    const size = primary.workAreaSize
    console.log('Display removed, broadcasting size', size)
    BrowserWindow.getAllWindows().forEach((win) => {
      if (!win.isDestroyed()) win.webContents.send('screen-size-changed', size)
    })
  })

  ipcMain.on('ping', () => console.log('pong'))

  createLoginWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow()
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('before-quit', () => {
  console.log('App is quitting, clearing localStorage...')
  clearAllLocalStorage()
})

app.on('will-quit', () => {
  console.log('App will quit, ensuring localStorage is cleared...')
  clearAllLocalStorage()
})

app.on('window-all-closed', () => {
  console.log('All windows closed, clearing localStorage...')
  clearAllLocalStorage()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  clearAllLocalStorage()
  app.quit()
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  clearAllLocalStorage()
  app.quit()
})

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, clearing localStorage...')
  clearAllLocalStorage()
  app.quit()
})

process.on('SIGINT', () => {
  console.log('Received SIGINT, clearing localStorage...')
  clearAllLocalStorage()
  app.quit()
})
