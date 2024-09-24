import { Book, UserFormData } from '@shared/types/types'
import { BrowserWindow, ipcMain } from 'electron'
import { io } from 'socket.io-client'

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
}

export function checkSocketStatus(): boolean {
  socket.connect
  console.log(socket.connected)

  return socket.connected
}

ipcMain.handle('sendUserDataToAdminApp', (_, userFormData: UserFormData) => {
  console.log('in server', userFormData)
  //send user form data to admin app
  socket.emit('newUserData', userFormData, (response: boolean) => {
    // get a response from admin app
    console.log(response)
    return response
  })
  console.log('data emitted')
})
