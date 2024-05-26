import { io } from 'socket.io-client'
const socket = io.connect('http://localhost:3000')

// socket.on('send message')
export function socketServer() {
  socket.emit('send message', { message: 'hello' })
  console.log('hello')
}
