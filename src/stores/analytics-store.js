import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAnalyticsStore = defineStore('analytics', () => {
  // ── Live Counters ──
  const totalOrdersToday = ref(5) // starting with existing orders
  const totalRevenueToday = ref(16160) // sum of existing orders
  const activeKitchenTickets = ref(2) // cooking orders
  const completedOrders = ref(0)

  // ── Item Sales Tracking ──
  const itemSales = ref({})
  // Pre-populate with some realistic data
  const initialSales = {
    'Chicken Kottu': { sold: 8, revenue: 6800 },
    'Cheese Burger': { sold: 5, revenue: 3900 },
    'Chicken Biryani': { sold: 4, revenue: 3800 },
    'Fresh Lime Juice': { sold: 12, revenue: 4200 },
    'Chocolate Lava Cake': { sold: 3, revenue: 2040 },
    'Garlic Butter Prawns': { sold: 2, revenue: 2560 },
  }
  itemSales.value = { ...initialSales }

  // ── Prep Time Tracking ──
  const prepTimes = ref([12, 15, 10, 18, 11]) // minutes
  const avgPrepTime = computed(() => {
    if (prepTimes.value.length === 0) return 0
    return Math.round(prepTimes.value.reduce((a, b) => a + b, 0) / prepTimes.value.length)
  })

  // ── Hourly Orders ──
  const hourlyOrders = ref({
    10: 2,
    11: 3,
    12: 8,
    13: 12,
    14: 6,
    15: 3,
    16: 2,
    17: 5,
    18: 10,
    19: 15,
    20: 12,
    21: 7,
  })

  // ── Category Revenue ──
  const categoryRevenue = ref({
    'Kottu & Roti': 8500,
    'Rice & Curry': 6200,
    Burgers: 5800,
    Beverages: 4500,
    Seafood: 3900,
    Desserts: 2200,
    Pasta: 3100,
    Starters: 4600,
  })

  // Category mapping for menu items
  const categoryMap = {
    starters: 'Starters',
    'rice-curry': 'Rice & Curry',
    kottu: 'Kottu & Roti',
    burgers: 'Burgers',
    pasta: 'Pasta',
    seafood: 'Seafood',
    beverages: 'Beverages',
    desserts: 'Desserts',
  }

  // ── Events Log (real-time feed) ──
  const eventLog = ref([])

  // ── Top Items computed ──
  const topItems = computed(() => {
    return Object.entries(itemSales.value)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 7)
  })

  // ── Methods ──

  // Called when a new order is placed
  function recordOrder(order) {
    totalOrdersToday.value++
    totalRevenueToday.value += order.totalAmount
    activeKitchenTickets.value++

    // Track hourly
    const hour = new Date().getHours()
    hourlyOrders.value[hour] = (hourlyOrders.value[hour] || 0) + 1

    // Track per-item sales
    order.items.forEach((item) => {
      if (!itemSales.value[item.name]) {
        itemSales.value[item.name] = { sold: 0, revenue: 0 }
      }
      itemSales.value[item.name].sold += item.quantity
      itemSales.value[item.name].revenue += (item.price || 0) * item.quantity
    })

    // Track category revenue
    if (order.items) {
      order.items.forEach((item) => {
        if (item.category) {
          const catName = categoryMap[item.category] || item.category
          categoryRevenue.value[catName] =
            (categoryRevenue.value[catName] || 0) + (item.price || 0) * item.quantity
        }
      })
    }

    // Log event
    eventLog.value.unshift({
      type: 'new_order',
      message: `Order ${order.id} placed from Table ${order.tableNumber}`,
      amount: order.totalAmount,
      timestamp: new Date(),
    })
  }

  // Called when chef starts cooking
  function recordCookingStart(orderId) {
    eventLog.value.unshift({
      type: 'cooking',
      message: `Order ${orderId} - Chef started cooking`,
      timestamp: new Date(),
    })
  }

  // Called when order is ready
  function recordOrderReady(orderId, prepTimeMinutes) {
    activeKitchenTickets.value = Math.max(0, activeKitchenTickets.value - 1)
    completedOrders.value++

    if (prepTimeMinutes) {
      prepTimes.value.push(prepTimeMinutes)
    }

    eventLog.value.unshift({
      type: 'ready',
      message: `Order ${orderId} is ready to serve!`,
      timestamp: new Date(),
    })
  }

  // Called when order is served
  function recordOrderServed(orderId) {
    eventLog.value.unshift({
      type: 'served',
      message: `Order ${orderId} served to customer`,
      timestamp: new Date(),
    })
  }

  return {
    totalOrdersToday,
    totalRevenueToday,
    activeKitchenTickets,
    completedOrders,
    itemSales,
    prepTimes,
    avgPrepTime,
    hourlyOrders,
    categoryRevenue,
    eventLog,
    topItems,
    recordOrder,
    recordCookingStart,
    recordOrderReady,
    recordOrderServed,
  }
})
