import { io } from 'socket.io-client'
const socket = io('http://localhost:3000')

// socket.on('send message')
export function socketServer(): void {
  socket.emit('send message', { message: 'hello' })
  console.log('hello')
}
