/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              SMARTDINE ANTIGRAVITY ENGINE                   ║
 * ║     Central Reactive Orchestrator — All Modules Connected   ║
 * ║                                                              ║
 * ║  When ONE event happens, ALL modules update in < 1 second   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useOrderStore } from './order-store'
import { useMenuStore } from './menu-store'
import { useInventoryStore } from './inventory-store'
import { useTableStore } from './table-store'
import { useAnalyticsStore } from './analytics-store'
import { useCartStore } from './cart-store'
import { useCustomerSessionStore } from './customer-session-store'
import {
  playNewOrderSound,
  playStatusSound,
  playReadySound,
  playWarningSound,
} from 'src/utils/sound-manager'

export const useSmartDineEngine = defineStore('engine', () => {
  // ── Engine State ──
  const isProcessing = ref(false)
  const lastEvent = ref(null)
  const notifications = ref([])
  let notifId = 100

  // ── Helper: Push notification ──
  function pushNotification(title, message, icon, color, type = 'info') {
    notifications.value.unshift({
      id: notifId++,
      title,
      message,
      icon,
      color,
      type,
      time: 'Just now',
      read: false,
      timestamp: new Date(),
    })
    // Keep max 20
    if (notifications.value.length > 20) notifications.value.pop()
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 1: QR SCAN — Customer scans table QR
  // ══════════════════════════════════════════════════════════
  function scanTable(tableNumber) {
    const tableStore = useTableStore()
    const result = tableStore.scanTable(tableNumber)

    if (result) {
      pushNotification(
        'Table Scanned',
        `Table ${tableNumber} — customer started browsing`,
        'qr_code_scanner',
        'blue',
      )
      lastEvent.value = { type: 'scan', table: tableNumber, time: new Date() }
    }

    return result
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 2: PLACE ORDER — The Big Trigger (6 modules)
  // ══════════════════════════════════════════════════════════
  function processOrder(tableNumber, customerSessionId = null) {
    isProcessing.value = true
    const orderStore = useOrderStore()
    const menuStore = useMenuStore()
    const inventoryStore = useInventoryStore()
    const tableStore = useTableStore()
    const analyticsStore = useAnalyticsStore()
    const cartStore = useCartStore()

    // Grab customerSessionId from session store if not provided
    if (!customerSessionId) {
      const sessionStore = useCustomerSessionStore()
      customerSessionId = sessionStore.sessionId
    }

    // Build order items with price and category for analytics
    const orderItems = cartStore.items.map((item) => {
      const menuItem = menuStore.menuItems.find((m) => m.id === item.id)
      return {
        name: item.name,
        quantity: item.quantity,
        notes: item.notes || '',
        price: item.price,
        category: menuItem?.category || '',
      }
    })

    // 🔊 SOUND ALERT — "Ting!" for Kitchen + Admin
    playNewOrderSound()

    // ── MODULE 1: Orders (KDS + Admin) ──
    const order = orderStore.placeOrder(orderItems, tableNumber, cartStore.total, customerSessionId)

    // ── MODULE 2: Inventory (BOM Deduction) ──
    const { deductions, alerts } = inventoryStore.deductForOrder(orderItems)

    // Generate alerts for low stock
    if (alerts.length > 0) playWarningSound()
    alerts.forEach((alert) => {
      if (alert.type === 'out_of_stock') {
        pushNotification(
          '🚨 Out of Stock!',
          `${alert.ingredient} is now EMPTY (0 ${alert.unit})`,
          'error',
          'red',
          'critical',
        )
      } else {
        pushNotification(
          '⚠️ Low Stock Alert',
          `${alert.ingredient} is low (${alert.stock} ${alert.unit} remaining)`,
          'warning',
          'amber',
          'warning',
        )
      }
    })

    // ── MODULE 3: Menu (Auto-Availability) ──
    menuStore.menuItems.forEach((item) => {
      const canMake = inventoryStore.canMakeItem(item.name)
      if (!canMake && item.isAvailable) {
        item.isAvailable = false
        pushNotification(
          '🍽️ Menu Auto-Update',
          `"${item.name}" marked unavailable (ingredients depleted)`,
          'restaurant_menu',
          'orange',
          'warning',
        )
      }
    })

    // ── MODULE 4: Dashboard (Live Stats) ──
    analyticsStore.recordOrder(order)

    // ── MODULE 5: Tables (Status → Waiting) ──
    tableStore.orderPlaced(tableNumber, order.id)

    // ── MODULE 6: Notification ──
    pushNotification(
      '🆕 New Order!',
      `${order.id} from Table ${tableNumber} — ${orderItems.length} items (Rs. ${cartStore.total.toLocaleString()})`,
      'receipt_long',
      'green',
    )

    // Clear cart
    cartStore.clearCart()

    lastEvent.value = {
      type: 'order',
      orderId: order.id,
      table: tableNumber,
      deductions,
      alerts,
      time: new Date(),
    }

    isProcessing.value = false
    return { order, deductions, alerts }
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 3: CHEF ACTIONS — Start Cooking
  // ══════════════════════════════════════════════════════════
  function startCooking(orderId) {
    const orderStore = useOrderStore()
    const tableStore = useTableStore()
    const analyticsStore = useAnalyticsStore()

    const order = orderStore.kdsOrders.find((o) => o.id === orderId)
    if (!order) return

    // 🔊 Status sound
    playStatusSound()

    // Update order status
    orderStore.updateOrderStatus(orderId, 'cooking')

    // Update table status
    tableStore.startCooking(order.tableNumber)

    // Analytics
    analyticsStore.recordCookingStart(orderId)

    // Notification
    pushNotification(
      '👨‍🍳 Cooking Started',
      `${orderId} — Chef started preparing Table ${order.tableNumber}'s food`,
      'local_fire_department',
      'deep-orange',
    )

    lastEvent.value = { type: 'cooking', orderId, time: new Date() }
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 4: ORDER READY
  // ══════════════════════════════════════════════════════════
  function markReady(orderId) {
    const orderStore = useOrderStore()
    const tableStore = useTableStore()
    const analyticsStore = useAnalyticsStore()

    const order = orderStore.kdsOrders.find((o) => o.id === orderId)
    if (!order) return

    // Calculate prep time
    const prepTimeMs = Date.now() - new Date(order.createdAt).getTime()
    const prepTimeMinutes = Math.round(prepTimeMs / 60000)

    // 🔊 Ready celebration sound!
    playReadySound()

    // Update order
    orderStore.updateOrderStatus(orderId, 'ready')

    // Update table
    tableStore.orderReady(order.tableNumber)

    // Analytics
    analyticsStore.recordOrderReady(orderId, prepTimeMinutes)

    pushNotification(
      '✅ Order Ready!',
      `${orderId} — Table ${order.tableNumber}'s food is ready to serve (${prepTimeMinutes} min)`,
      'check_circle',
      'green',
    )

    lastEvent.value = { type: 'ready', orderId, prepTimeMinutes, time: new Date() }
  }

  // ══════════════════════════════════════════════════════════
  // PHASE 5: ORDER SERVED
  // ══════════════════════════════════════════════════════════
  function markServed(orderId) {
    const orderStore = useOrderStore()
    const tableStore = useTableStore()
    const analyticsStore = useAnalyticsStore()

    const order = orderStore.kdsOrders.find((o) => o.id === orderId)
    if (!order) return

    orderStore.updateOrderStatus(orderId, 'served')
    tableStore.orderServed(order.tableNumber)
    analyticsStore.recordOrderServed(orderId)

    pushNotification(
      '🍽️ Order Served',
      `${orderId} served to Table ${order.tableNumber}`,
      'done_all',
      'teal',
    )

    lastEvent.value = { type: 'served', orderId, time: new Date() }
  }

  return {
    isProcessing,
    lastEvent,
    notifications,
    pushNotification,
    scanTable,
    processOrder,
    startCooking,
    markReady,
    markServed,
  }
})
