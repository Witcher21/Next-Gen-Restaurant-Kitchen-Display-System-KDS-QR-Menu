import { Router } from 'express'
import MenuItem from '../models/MenuItem.js'

const router = Router()

// GET /api/menu - Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query
    const filter = {}
    if (category) filter.category = category
    if (available !== undefined) filter.isAvailable = available === 'true'
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/menu/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category')
    res.json(categories)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/menu/:id - Get single item
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/menu - Create menu item (Admin)
router.post('/', async (req, res) => {
  try {
    const item = await MenuItem.create(req.body)
    req.app.get('io').emit('menuUpdated', { action: 'created', item })
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/menu/:id - Update menu item (Admin)
router.put('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!item) return res.status(404).json({ error: 'Item not found' })
    req.app.get('io').emit('menuUpdated', { action: 'updated', item })
    res.json(item)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/menu/:id - Delete menu item (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ error: 'Item not found' })
    req.app.get('io').emit('menuUpdated', { action: 'deleted', itemId: req.params.id })
    res.json({ message: 'Item deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/menu/:id/availability - Toggle availability (Admin)
router.patch('/:id/availability', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) return res.status(404).json({ error: 'Item not found' })
    item.isAvailable = !item.isAvailable
    await item.save()
    req.app.get('io').emit('menuUpdated', { action: 'availability', item })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
