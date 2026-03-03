import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

// GET /api/analytics/daily-sales - Dawase sales data
router.get('/daily-sales', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const orders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: { $ne: 'cancelled' },
    })

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

    // Items sold breakdown
    const itemsSold = {}
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemsSold[item.name]) {
          itemsSold[item.name] = { name: item.name, quantity: 0, revenue: 0 }
        }
        itemsSold[item.name].quantity += item.quantity
        itemsSold[item.name].revenue += (item.price || 0) * item.quantity
      })
    })

    // Hourly breakdown
    const hourlyBreakdown = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      orders: 0,
      revenue: 0,
    }))

    orders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours()
      hourlyBreakdown[hour].orders++
      hourlyBreakdown[hour].revenue += order.totalAmount
    })

    // Peak hour
    const peakHour = hourlyBreakdown.reduce(
      (peak, h) => (h.orders > peak.orders ? h : peak),
      hourlyBreakdown[0],
    )

    // Status breakdown
    const statusBreakdown = {
      pending: orders.filter((o) => o.status === 'pending').length,
      cooking: orders.filter((o) => o.status === 'cooking').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      served: orders.filter((o) => o.status === 'served').length,
    }

    res.json({
      date: today.toISOString().split('T')[0],
      totalOrders,
      totalRevenue,
      avgOrderValue,
      peakHour: { hour: peakHour.hour, orders: peakHour.orders },
      statusBreakdown,
      topSellingItems: Object.values(itemsSold)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 10),
      hourlyBreakdown: hourlyBreakdown.filter((h) => h.orders > 0),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/analytics/weekly-summary
router.get('/weekly-summary', async (req, res) => {
  try {
    const today = new Date()
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)

    const orders = await Order.find({
      createdAt: { $gte: weekAgo },
      status: { $ne: 'cancelled' },
    })

    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

    // Daily breakdown
    const dailyBreakdown = {}
    for (let i = 0; i < 7; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      dailyBreakdown[key] = { date: key, orders: 0, revenue: 0 }
    }

    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().split('T')[0]
      if (dailyBreakdown[key]) {
        dailyBreakdown[key].orders++
        dailyBreakdown[key].revenue += order.totalAmount
      }
    })

    res.json({
      period: `${weekAgo.toISOString().split('T')[0]} to ${today.toISOString().split('T')[0]}`,
      totalOrders,
      totalRevenue,
      avgDailyOrders: Math.round(totalOrders / 7),
      avgDailyRevenue: Math.round(totalRevenue / 7),
      dailyBreakdown: Object.values(dailyBreakdown).reverse(),
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
