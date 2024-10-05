import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png?asset'
import icon from '../../resources/icon.png?asset'
import { startSocketIOServer } from './server'
import { Admin, Book, BookHistory, Other, User, issuedBookType } from '@shared/types/types'

import { addAdminData, getAdminData, resetAdminPassword } from './utilities/admin'
import {
  addOtherData,
  getOtherData,
  storeDeletedId,
  updateBookCount,
  updateOtherData
} from './utilities/other'
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
  getOneBookData,
  updateBookData,
  updateBookQuantity
} from './utilities/resources'
import ExcelJs from 'exceljs'
import JsBarcode from 'jsbarcode'
import { addBookHistory } from './utilities/history'

// Add the other data db in device
addOtherData()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: { color: '#121212', symbolColor: 'white', height: 8 },
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      spellcheck: false
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

  startSocketIOServer(mainWindow)
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

  // ----------------PouchDB ----------------
  ipcMain.handle('getAdminData', () => getAdminData())
  ipcMain.handle('addAdminData', (_, newAdminData: Admin) => addAdminData(newAdminData))
  ipcMain.handle('resetAdminPassword', (_, password: string) => resetAdminPassword(password))

  ipcMain.handle('getOtherData', () => getOtherData())
  ipcMain.handle('storeDeletedId', (_, bookId: string) => storeDeletedId(bookId))
  ipcMain.handle('updateBookCount', (_, updatedOtherData: Other) =>
    updateBookCount(updatedOtherData)
  )
  ipcMain.handle('updateOtherData', (_, updatedOtherData: Other) =>
    updateOtherData(updatedOtherData)
  )

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
  ipcMain.handle('removeBookRequest', (_, userId: string, bookId: string) =>
    removeBookRequest(userId, bookId)
  )
  ipcMain.handle('decrementBookQuantity', (_, bookId: string) => decrementBookQuantity(bookId))

  ipcMain.handle('getBookData', () => getBookData())
  ipcMain.handle('getOneBookData', (_, docId: string) => getOneBookData(docId))
  ipcMain.handle('addNewBook', (_, newBookData: Book) => addNewBookData(newBookData))
  ipcMain.handle('updateBookData', (_, bookData: Book) => updateBookData(bookData))
  ipcMain.handle('deleteOneBook', (_, bookId: string) => deleteOneBook(bookId))
  ipcMain.handle('updateBookQuantity', (_, bookId: string, updatedBookQuantity: number) =>
    updateBookQuantity(bookId, updatedBookQuantity)
  )

  ipcMain.handle('addBookHistory', (_, userId, bookHistory: BookHistory) => {
    addBookHistory(userId, bookHistory)
  })

  function generateBarCode(barcode: string): string {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, barcode, { format: 'CODE39' })

    return canvas.toDataURL('image/png')
  }

  async function sampleExport(_data, filePath: string): Promise<void> {
    const data = [
      {
        title: '456',
        barcode: '456'
      },
      {
        title: '123',
        barcode: '123'
      }
    ]
    const workBook = new ExcelJs.Workbook()
    const workSheet = workBook.addWorksheet('Library')

    workSheet.getRow(1).getCell('A1').value = 'Book Title'
    workSheet.getRow(1).getCell('B1').value = 'Book Barcode'

    data.forEach((item, index) => {
      const row = workSheet.getRow(index + 2)
      row.getCell(1).value = item.title
      const barcode = generateBarCode(item.barcode)
      const image = workBook.addImage({
        base64: barcode,
        extension: 'png'
      })
      workSheet.addImage(image, `B${index + 2}`)
    })

    await workBook.xlsx.writeFile(filePath)
    console.log('file saved')
  }

  ipcMain.handle('export-excel', async (_, data) => {
    const result = await dialog.showSaveDialog({
      title: 'Save Excel file',
      defaultPath: path.join(__dirname, 'exported data'),
      buttonLabel: 'Save',
      filters: [{ name: 'excel files', extensions: ['xlsx'] }]
    })

    if (result.canceled) return

    sampleExport(data, result.filePath)
  })
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
