import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
// import { subjects } from '../shared/Data'
import { getBookData } from './utilities/resources'
import { Book, UserFormData } from '@shared/types/types'

export function startSocketIOServer(): void {
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

  io.on('connection', async (socket) => {
    console.log('user connected' + socket.id)
    sendBookData(socket)
    getNewUserData(socket)

    socket.on('disconnect', () => {
      console.log('User disconnected')
    })
  })

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000')
  })
}

async function sendBookData(socket): Promise<void> {
  const bookData: Book[] = await getBookData()
  socket.emit('bookData', bookData)
  console.log('User Data sent to client app')
}

function getNewUserData(socket): void {
  socket.on('newUserData', (userFormData: UserFormData, callback) => {
    console.log('got user data from client app', userFormData)

    // send a response back to the client app
    if (callback) {
      callback(true)
    }
  })
}
