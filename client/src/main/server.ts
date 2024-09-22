import { BrowserWindow } from 'electron'
import { io } from 'socket.io-client'
import { Book } from 'src/shared/types/types'

const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,
  timeout: 3000
})

export let connectionState: boolean = false
export let bookData: Book[]

export function socketServer(mainWindow: BrowserWindow): void {
  console.log('Attempting to connect to socket server...')

  socket.on('connect', () => {
    console.log('Socket connected successfully')
    connectionState = socket.connected
    mainWindow.webContents.send('connection', socket.connected)
  })

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after attempt:', attemptNumber)
    // mainWindow.webContents.send('connection', socket.connected)
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected')
    connectionState = socket.connected
    mainWindow.webContents.send('connection', socket.connected)
  })

  socket.on('connect_error', (error) => {
    console.log('connection error', error.name)
  })

  socket.on('reconnect_attempt', () => {
    console.log('Reconnect Attempt')
  })

  socket.on('reconnect_failed', () => {
    console.log('Reconnect Failed')
  })

  socket.on('bookData', (data) => {
    bookData = data
    console.log(bookData)
    mainWindow.webContents.send('bookData', data)
  })

  // ipcMain.handle('getSubjects', () => {
  //   return subjects
  // })

  // socket.emit('send message', { message: 'ho' })
}

export function checkSocketStatus(): boolean {
  socket.connect
  console.log(socket.connected)

  return socket.connected
}
// ipcMain.handle('pong', () => {
//   console.log(subjects)
// })
