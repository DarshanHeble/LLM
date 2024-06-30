import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { startSocketIOServer } from './server'
import { Admin, Book, User } from '@shared/types'
import { addUserData, deleteUserData, editUserData, getUserData } from './utils/user'
import { addAdminData, getAdminData, resetAdminPassword } from './utils/admin'
import {
  addNewBookData,
  deleteOneBook,
  getBookData,
  getOneBookData,
  updateBookData
} from './utils/book'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  startSocketIOServer()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('getUserData', () => getUserData('StudentAccountData'))
  ipcMain.handle('addNewUser', (_, newUserData: User) =>
    addUserData('StudentAccountData', newUserData)
  )
  ipcMain.handle('deleteUser', (_, userId: string) => deleteUserData('StudentAccountData', userId))
  ipcMain.handle('editUser', (_, updatedUserData: User) =>
    editUserData('StudentAccountData', updatedUserData)
  )

  ipcMain.handle('getBookData', () => getBookData('BookData'))
  ipcMain.handle('getOneBookData', (_, docId: string) => getOneBookData('BookData', docId))
  ipcMain.handle('addNewBook', (_, newBookData: Book) => addNewBookData(newBookData))
  ipcMain.handle('updateBookData', (_, bookData: Book) => updateBookData('BookData', bookData))
  ipcMain.handle('deleteOneBook', (_, bookId: string) => deleteOneBook(bookId))

  ipcMain.handle('getAdminData', () => getAdminData('Admin'))
  ipcMain.handle('addAdminData', (_, newAdminData: Admin) => addAdminData(newAdminData))
  ipcMain.handle('resetAdminPassword', (_, password: number) =>
    resetAdminPassword('Admin', password)
  )

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
