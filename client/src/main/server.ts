import { BrowserWindow } from 'electron'
import { io } from 'socket.io-client'
import {} from '../shared/Data'
const socket = io('http://localhost:3000', {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,
  timeout: 3000
})

export let connectionState: boolean = false
export let subjects: string[]

export function socketServer(mainWindow: BrowserWindow): void {
  socket.on('disconnect', () => {
    console.log('disconnected')
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

  socket.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after attempt:', attemptNumber)
    // mainWindow.webContents.send('connection', socket.connected)
  })

  socket.on('connect', () => {
    console.log('connected')
    connectionState = socket.connected
    mainWindow.webContents.send('connection', socket.connected)
  })

  socket.on('data', (data) => {
    subjects = data
    console.log(subjects)
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
