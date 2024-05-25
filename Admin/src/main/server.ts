// src/server.ts
import { Server } from 'socket.io'

const io = new Server(3000, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')

  socket.on('disconnect', () => {
    console.log('user disconnected')
  })

  socket.on('message', (msg) => {
    console.log('message: ' + msg)
    // Broadcast the message to all connected clients
    io.emit('message', msg)
  })
})

console.log('Socket.IO server running at http://localhost:3000/')
