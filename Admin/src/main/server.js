import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

export function startSocketIOServer() {
  const app = express()
  const server = createServer(app)

  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  })

  app.get('/', (req, res) => {
    res.send('hello')
  })

  io.on('connection', (socket) => {
    console.log('user connected' + socket.id)
    socket.on('disconnect', () => {
      console.log('User disconnected')
    })

    socket.on('Message', (msg) => {
      console.log('message: ' + msg)
      io.emit('Message', msg)
    })
    socket.on('send message', (data) => {
      console.log(data)
    })
  })

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000')
  })
}
