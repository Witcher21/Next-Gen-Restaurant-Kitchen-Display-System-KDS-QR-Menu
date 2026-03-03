import { Router } from 'express'
import Table from '../models/Table.js'

const router = Router()

// GET /api/tables - Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 })
    res.json(tables)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/tables - Create table (Admin)
router.post('/', async (req, res) => {
  try {
    const table = await Table.create(req.body)
    res.status(201).json(table)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH /api/tables/:tableNumber/status - Update table status
router.patch('/:tableNumber/status', async (req, res) => {
  try {
    const { status } = req.body
    const table = await Table.findOneAndUpdate(
      { tableNumber: req.params.tableNumber },
      { status },
      { new: true },
    )
    if (!table) return res.status(404).json({ error: 'Table not found' })
    req.app.get('io').emit('tableStatusChanged', table)
    res.json(table)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
