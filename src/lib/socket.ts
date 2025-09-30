import { io } from 'socket.io-client'

export const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
  withCredentials: true,
  autoConnect: false, // Don't connect until needed
})

// Socket event handlers for better debugging
socket.on('connect', () => {
  console.log('Connected to auction server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from auction server')
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error)
})