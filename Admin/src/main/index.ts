import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
import icon from '../../resources/icon.png?asset'
import { startSocketIOServer } from './server'
import { Admin, Book, Other, User, issuedBookType } from '@shared/types'
import { addBookToTheUser, deleteUserData, getOneUserData, returnBookToLibrary } from './utils/user'
// import { addAdminData, getAdminData, resetAdminPassword } from './utils/admin'
import {
  addNewBookData,
  deleteOneBook,
  getBookData,
  getOneBookData,
  updateBookData,
  updateBookQuantity
} from './utils/book'
import { addAdminData, getAdminData, resetAdminPassword } from './utilities/admin'
import { addOtherData, getOtherData, updateBookCount } from './utilities/other'
import { addUserData, getUserData, editUserData } from './utilities/users'

// Add the other data db in device
addOtherData()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
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

  // ipcMain.handle('getUserData', () => getUserData('StudentAccountData'))
  ipcMain.handle('getOneUserData', (_, docId: string) =>
    getOneUserData('StudentAccountData', docId)
  )
  // ipcMain.handle('addNewUser', (_, newUserData: User) =>
  //   addUserData('StudentAccountData', newUserData)
  // )
  ipcMain.handle('deleteUser', (_, userId: string) => deleteUserData('StudentAccountData', userId))
  // ipcMain.handle('editUser', (_, updatedUserData: User) =>
  //   editUserData('StudentAccountData', updatedUserData)
  // )

  ipcMain.handle(
    'addBookToTheUser',
    (_, userId: string, noOfBooks: number, issuedBookData: issuedBookType) =>
      addBookToTheUser('StudentAccountData', userId, noOfBooks, issuedBookData)
  )

  ipcMain.handle('returnBookToLibrary', (_, userId: string, bookId: string) =>
    returnBookToLibrary('StudentAccountData', userId, bookId)
  )

  ipcMain.handle('getBookData', () => getBookData('BookData'))
  ipcMain.handle('getOneBookData', (_, docId: string) => getOneBookData('BookData', docId))
  ipcMain.handle('addNewBook', (_, newBookData: Book) => addNewBookData(newBookData))
  ipcMain.handle('updateBookData', (_, bookData: Book) => updateBookData('BookData', bookData))
  ipcMain.handle('deleteOneBook', (_, bookId: string) => deleteOneBook(bookId))

  ipcMain.handle('updateBookQuantity', (_, bookId: string, updatedBookQuantity: number) =>
    updateBookQuantity('BookData', bookId, updatedBookQuantity)
  )

  // ----------------PouchDB ----------------
  ipcMain.handle('getAdminData', () => getAdminData())
  ipcMain.handle('addAdminData', (_, newAdminData: Admin) => addAdminData(newAdminData))
  ipcMain.handle('resetAdminPassword', (_, password: string) => resetAdminPassword(password))

  ipcMain.handle('getOtherData', () => getOtherData())
  ipcMain.handle('updateBookCount', (_, updatedOtherData: Other) =>
    updateBookCount(updatedOtherData)
  )

  ipcMain.handle('addNewUser', (_, newUserData: User) => addUserData(newUserData))
  ipcMain.handle('getUserData', () => getUserData())
  ipcMain.handle('editUser', (_, updatedUserData: User) => editUserData(updatedUserData))

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
