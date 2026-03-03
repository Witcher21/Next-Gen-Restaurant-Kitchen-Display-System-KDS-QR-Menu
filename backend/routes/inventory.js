import { Router } from 'express'
import Inventory from '../models/Inventory.js'

const router = Router()

// GET /api/inventory - Get all inventory items
router.get('/', async (req, res) => {
  try {
    const { low } = req.query
    let items
    if (low === 'true') {
      // Get only items where stockLevel <= minStockAlert
      items = await Inventory.find({ $expr: { $lte: ['$stockLevel', '$minStockAlert'] } })
    } else {
      items = await Inventory.find().sort({ ingredientName: 1 })
    }
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/inventory - Add new ingredient
router.post('/', async (req, res) => {
  try {
    const item = await Inventory.create(req.body)
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/inventory/:id - Update stock level
router.put('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!item) return res.status(404).json({ error: 'Inventory item not found' })

    // Alert if low stock after update
    if (item.isLowStock) {
      req.app.get('io').emit('lowStockAlert', {
        ingredientName: item.ingredientName,
        stockLevel: item.stockLevel,
        unit: item.unit,
      })
    }
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PATCH /api/inventory/:id/restock - Restock an ingredient
router.patch('/:id/restock', async (req, res) => {
  try {
    const { quantity } = req.body
    if (!quantity || quantity <= 0)
      return res.status(400).json({ error: 'Quantity must be positive' })

    const item = await Inventory.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Inventory item not found' })

    item.stockLevel += quantity
    item.lastRestocked = new Date()
    await item.save()

    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/inventory/:id - Remove ingredient
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ error: 'Inventory item not found' })
    res.json({ message: 'Inventory item deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
