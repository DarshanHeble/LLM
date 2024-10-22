import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
// import { subjects } from '../shared/Data'
import { getBookData } from './utilities/resources'
import { Book, Other, User } from '@shared/types/types'
import { BrowserWindow, ipcMain } from 'electron'
import { getOtherData } from './utilities/other'
import { addUserData, getAllUserIds, getOneUserData, requestBook } from './utilities/users'
import { pdbUsers } from './pouchdb'

export async function startSocketIOServer(mainWindow: BrowserWindow): Promise<void> {
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
    // sendUserData(socket)
    sendUserIds(socket)
    getNewUserData(mainWindow, socket)
    getRequestedBook(mainWindow, socket)

    IpcMethods(socket)

    getAndSendBookRequestCount(socket)
    getAndSendOneUserData(socket)

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

// async function sendUserData(socket): Promise<void> {
//   const userData: User[] = await getUserData()
//   socket.emit('userData', userData)
//   console.log('User Data sent to client app')
// }

async function sendUserIds(socket): Promise<void> {
  const userIds: string[] = await getAllUserIds()
  socket.emit('userIds', userIds)
  console.log('User Data sent to client app')
}

async function getRequestedBook(mainWindow: BrowserWindow, socket): Promise<void> {
  socket.on('RequestBook', async (userId: string, BookId: string, callback) => {
    console.log('got data from client', userId, BookId)

    // Request the book on behalf of the user
    const response = await requestBook(userId, BookId)

    // Check if the book was requested successfully
    if (!response) {
      if (callback) {
        callback(false)
      }
    }
    // sendBookData(socket)
    // sendUserData(socket)
    mainWindow.webContents.send('RequestedBook')
    if (callback) {
      callback(true)
    }
  })
  console.log('User Data sent to client app')
}

function getNewUserData(mainWindow: BrowserWindow, socket): void {
  socket.on('newUserData', async (userFormData: User, callback) => {
    console.log('got user data from client app', userFormData)

    const otherData: Other | null = await getOtherData()

    if (otherData == null) {
      if (callback) {
        callback(false)
      }
      return
    }

    if (otherData.activeDrawerItem === '/manageUsers') {
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

    sendUserIds(socket)
    if (callback) {
      // send a response back to the client app
      callback(true)
    }
  })
}

function IpcMethods(socket): void {
  ipcMain.on('sendBookDataToClient', () => {
    sendBookData(socket)
  })

  // ipcMain.on('sendUserDataToClient', () => {
  //   sendUserData(socket)
  // })
}

function getAndSendBookRequestCount(socket): void {
  socket.on('getBookRequestCount', async (bookId: string, callback) => {
    const count = await getUserCountForRequestedBook(bookId)
    console.log('count: ' + count)

    if (callback) {
      callback(count)
    }
  })
}

const getUserCountForRequestedBook = async (bookId: string): Promise<number> => {
  try {
    const result = await pdbUsers.find({
      selector: {
        requestedBooks: {
          $elemMatch: {
            _id: bookId // Check if any element in requestedBooks array has _id equal to bookId
          }
        }
      }
    })

    // const indexes = await pdbUsers.getIndexes()
    // console.log('index', indexes.indexes[0].def)

    console.log(`Users who requested book ${bookId}:`, result.docs.length)
    return result.docs.length
  } catch (error) {
    console.error('Error querying users:', error)
    return 0
  }
}

function getAndSendOneUserData(socket): void {
  socket.on('getOneUserData', async (userId, callback) => {
    const user = await getOneUserData(userId)

    if (user) if (callback) callback(user)
  })
}
