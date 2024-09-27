import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
// import { subjects } from '../shared/Data'
import { getBookData } from './utilities/resources'
import { Book, Other, User } from '@shared/types/types'
import { BrowserWindow } from 'electron'
import { getOtherData } from './utilities/other'
import { addUserData, getUserData } from './utilities/users'

export function startSocketIOServer(mainWindow: BrowserWindow): void {
  const app = express()
  const server = createServer(app)

  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  app.get('/', (_req, res) => {
    res.send('Server running at http://localhost:3000')
  })
  // ---------------- main code
  io.on('connection', async (socket) => {
    console.log('user connected' + socket.id)
    sendBookData(socket)
    sendUserData(socket)
    getNewUserData(mainWindow, socket)

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
    // --------------
  })

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000')
  })
}

async function sendBookData(socket): Promise<void> {
  const bookData: Book[] = await getBookData()
  socket.emit('bookData', bookData)
  console.log('Book Data sent to client app')
}

async function sendUserData(socket): Promise<void> {
  const userData: User[] = await getUserData()
  socket.emit('userData', userData)
  console.log('User Data sent to client app')
}

function getNewUserData(mainWindow: BrowserWindow, socket): void {
  socket.on('newUserData', async (userFormData: User, callback) => {
    console.log('got user data from client app', userFormData)

    const otherData: Other | null = await getOtherData()

    if (otherData == null) {
      return
    }

    if (otherData.activeDrawerItem === 'Manage Users') {
      mainWindow.webContents.send('newUserData', userFormData)
      console.log('data sended to admin Manage User page')
    } else {
      const isUserAdded = await addUserData(userFormData)

      if (isUserAdded) {
        // if user is added then send true stmt
        if (callback) {
          callback(true) // send a response back to the client app
        }
        mainWindow.webContents.send('isUserAdded', userFormData, true)
      } else {
        // if user is not added then send false stmt
        if (callback) {
          callback(false) // send a response back to the client app
        }
        mainWindow.webContents.send('isUserAdded', userFormData, false)
      }
    }

    if (callback) {
      // send a response back to the client app
      callback(true)
    }
  })
}
