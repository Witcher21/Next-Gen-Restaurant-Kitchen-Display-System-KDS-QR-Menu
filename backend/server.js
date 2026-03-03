import 'dotenv/config'
import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import menuRoutes from './routes/menu.js'
import orderRoutes from './routes/orders.js'
import tableRoutes from './routes/tables.js'
import inventoryRoutes from './routes/inventory.js'
import analyticsRoutes from './routes/analytics.js'
import { setupSocketHandlers } from './socket/handlers.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// Make io accessible in routes
app.set('io', io)

// API Routes
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/tables', tableRoutes)
app.use('/api/inventory', inventoryRoutes)
app.use('/api/analytics', analyticsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartDine Backend is running 🍽️', timestamp: new Date() })
})

// Socket.io setup
setupSocketHandlers(io)

// Error handler (next is required by Express signature)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

// Start server
const PORT = process.env.PORT || 3001

async function start() {
  await connectDB()
  server.listen(PORT, () => {
    console.log(`\n🍽️  SmartDine Backend running on http://localhost:${PORT}`)
    console.log(`📡 Socket.io ready for real-time connections`)
    console.log(`📋 API Docs: http://localhost:${PORT}/api/health\n`)
  })
}

start().catch(console.error)
