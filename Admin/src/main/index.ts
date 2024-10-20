import { app, shell, BrowserWindow, ipcMain, nativeTheme } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
import icon from '../../resources/icon.png?asset'
import { startSocketIOServer } from './server'
import { Admin, Book, BookHistory, Other, User, issuedBookType } from '@shared/types/types'

import { addAdminData, deleteAdminData, getAdminData, resetAdminPassword } from './utilities/admin'
import { addOtherData, getOtherData, storeDeletedId, updateOtherData } from './utilities/other'
import {
  addUserData,
  getUserData,
  editUserData,
  deleteUserData,
  getOneUserData,
  addBookToTheUser,
  returnBookToLibrary,
  removeBookRequest
} from './utilities/users'
import {
  addNewBookData,
  decrementBookQuantity,
  deleteOneBook,
  getBookData,
  getBookDataFromExcel,
  getOneBookData,
  updateBookData,
  updateBookQuantity
} from './utilities/resources'

import { addBookHistory, getUserHistory } from './utilities/history'

// Add the other data db in device
addOtherData()

// EventEmitter.defaultMaxListeners = 20

// process.on('warning', (warning) => {
//   console.warn(warning.name) // 'MaxListenersExceededWarning'
//   console.warn(warning.message) // Message about the warning
//   console.warn(warning.stack) // Stack trace
// })

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#121212', symbolColor: 'white', height: 30 },
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      spellcheck: false
    }
  })
  nativeTheme.themeSource = 'dark'

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

  startSocketIOServer(mainWindow)

  // Enable DevTools in development mode
  if (is.dev) {
    mainWindow.webContents.openDevTools()

    // Register shortcuts for DevTools
    app.whenReady().then(() => {
      // globalShortcut.register('Control+Shift+I', () => {
      //   mainWindow.webContents.toggleDevTools()
      // })
      // globalShortcut.register('F12', () => {
      //   mainWindow.webContents.toggleDevTools()
      // })
      // globalShortcut.register('Control+b', () => {
      //   mainWindow.webContents.send('toggleSideBar')
      //   console.log('toggleSideBar')
      // })
    })
  }
  // Remove the white line issue by adjusting CSS in full-screen mode
  // mainWindow.on('enter-full-screen', () => {
  //   mainWindow.webContents.executeJavaScript(`
  //     document.body.style.margin = "0";
  //     document.body.style.height = "100vh";
  //   `)
  // })

  // mainWindow.on('leave-full-screen', () => {
  //   mainWindow.webContents.executeJavaScript(`
  //     document.body.style.margin = "initial";
  //     document.body.style.height = "initial";
  //   `)
  // })
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

  ipcMain.handle('isDev', () => is.dev)

  // ----------------PouchDB ----------------
  function admin(): void {
    ipcMain.handle('getAdminData', () => getAdminData())
    ipcMain.handle('addAdminData', (_, newAdminData: Admin) => addAdminData(newAdminData))
    ipcMain.handle('deleteAdminData', () => deleteAdminData())
    ipcMain.handle('resetAdminPassword', (_, password: string) => resetAdminPassword(password))
  }

  function other(): void {
    ipcMain.handle('getOtherData', () => getOtherData())
    ipcMain.handle('storeDeletedId', (_, bookId: string) => storeDeletedId(bookId))
    ipcMain.handle('updateBookCount', (_, updatedOtherData: Other) =>
      updateOtherData(updatedOtherData)
    )
    ipcMain.handle('updateOtherData', (_, updatedOtherData: Other) =>
      updateOtherData(updatedOtherData)
    )
  }

  function user(): void {
    ipcMain.handle('addNewUser', (_, newUserData: User) => addUserData(newUserData))
    ipcMain.handle('getUserData', () => getUserData())
    ipcMain.handle('getOneUserData', (_, docId: string) => getOneUserData(docId))
    ipcMain.handle('editUser', (_, updatedUserData: User) => editUserData(updatedUserData))
    ipcMain.handle('deleteUser', (_, userId: string) => deleteUserData(userId))
    ipcMain.handle('addBookToTheUser', (_, userId: string, issuedBookData: issuedBookType) =>
      addBookToTheUser(userId, issuedBookData)
    )

    ipcMain.handle('returnBookToLibrary', (_, userId: string, bookId: string) =>
      returnBookToLibrary(userId, bookId)
    )
  }

  function resource(): void {
    ipcMain.handle('getBookData', () => getBookData())
    ipcMain.handle('getOneBookData', (_, docId: string) => getOneBookData(docId))
    ipcMain.handle('addNewBook', (_, newBookData: Book) => addNewBookData(newBookData))
    ipcMain.handle('updateBookData', (_, bookData: Book) => updateBookData(bookData))
    ipcMain.handle('deleteOneBook', (_, bookId: string) => deleteOneBook(bookId))
    ipcMain.handle('updateBookQuantity', (_, bookId: string, updatedBookQuantity: number) =>
      updateBookQuantity(bookId, updatedBookQuantity)
    )
    ipcMain.handle('removeBookRequest', (_, userId: string, bookId: string) =>
      removeBookRequest(userId, bookId)
    )
    ipcMain.handle('decrementBookQuantity', (_, bookId: string) => decrementBookQuantity(bookId))

    ipcMain.handle('getBookDataFromExcel', () => getBookDataFromExcel())
  }

  function userHistory(): void {
    ipcMain.handle('addBookHistory', (_, userId, bookHistory: BookHistory) => {
      addBookHistory(userId, bookHistory)
    })

    ipcMain.handle('getUserHistory', () => getUserHistory())
  }

  admin()
  other()
  user()
  resource()
  userHistory()

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
