import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

// GET /api/orders - Get all orders (with optional status filter)
router.get('/', async (req, res) => {
  try {
    const { status, table } = req.query
    const filter = {}
    if (status) filter.status = status
    if (table) filter.tableNumber = Number(table)
    const orders = await Order.find(filter).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/orders/:id - Get single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/orders - Place new order
router.post('/', async (req, res) => {
  try {
    const { tableNumber, items, totalAmount } = req.body
    const order = await Order.create({ tableNumber, items, totalAmount })

    // Emit to KDS via Socket.io
    const io = req.app.get('io')
    io.to('kds').emit('newOrder', order)
    io.to(`table-${tableNumber}`).emit('orderPlaced', order)

    res.status(201).json(order)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH /api/orders/:id/status - Update order status (KDS)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'cooking', 'ready', 'served', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` })
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { status },
      { new: true },
    )
    if (!order) return res.status(404).json({ error: 'Order not found' })

    // Emit status change via Socket.io (spec events)
    const io = req.app.get('io')
    io.to('kds').emit('orderStatusChanged', { orderId: order.orderId, status })
    // statusChanged: Server eken customer ge phone ekata order eke thathwaya yawana event eka
    io.to(`table-${order.tableNumber}`).emit('statusChanged', { orderId: order.orderId, status })

    res.json(order)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
