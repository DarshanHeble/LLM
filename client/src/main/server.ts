import { BrowserWindow } from 'electron'
import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

export let subjects: string[]

export function socketServer(mainWindow: BrowserWindow): void {
  socket.on('disconnect', () => {
    console.log('disconnected')
    mainWindow.webContents.send('subject', socket.connected)
  })
  socket.on('connect_error', (error) => {
    console.log('error')
    console.log(error)
  })

  socket.on('connect', () => {
    console.log('connected')
    mainWindow.webContents.send('subject', socket.connected)

    socket.on('data', (data) => {
      console.log(data)
      subjects = data
    })
  })

  // socket.emit('send message', { message: 'ho' })
}
// ipcMain.handle('pong', () => {
//   console.log(subjects)
// })

// ipcMain.handle('getSubjects', () => {
//   return subjects
// })
