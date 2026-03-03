import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useTableStore = defineStore('tables', () => {
  // Table statuses: available → browsing → waiting → dining → cleaning → available
  const tables = ref([
    {
      number: 1,
      capacity: 2,
      status: 'occupied',
      currentOrder: 'ORD-004',
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 2,
      capacity: 4,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 3,
      capacity: 4,
      status: 'occupied',
      currentOrder: 'ORD-002',
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 4,
      capacity: 6,
      status: 'reserved',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 5,
      capacity: 4,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 6,
      capacity: 2,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 7,
      capacity: 8,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 8,
      capacity: 4,
      status: 'occupied',
      currentOrder: 'ORD-003',
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 9,
      capacity: 6,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 10,
      capacity: 2,
      status: 'reserved',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 11,
      capacity: 4,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    },
    {
      number: 12,
      capacity: 6,
      status: 'occupied',
      currentOrder: 'ORD-005',
      sessionId: null,
      scannedAt: null,
    },
  ])

  // Restore tables from localStorage
  const savedTables = localStorage.getItem('smartdine_tables')
  if (savedTables) {
    try {
      tables.value = JSON.parse(savedTables)
    } catch (e) {
      console.error('Failed to parse saved tables', e)
    }
  }

  // Auto-sync tables to localStorage to reflect across tabs for customers
  watch(
    tables,
    (newVal) => {
      localStorage.setItem('smartdine_tables', JSON.stringify(newVal))
    },
    { deep: true },
  )

  // Status colors and labels
  const statusConfig = {
    available: { color: 'green', label: 'Available', icon: 'check_circle' },
    browsing: { color: 'blue', label: 'Browsing Menu', icon: 'menu_book' },
    occupied: { color: 'orange', label: 'Order Placed', icon: 'receipt_long' },
    waiting: { color: 'amber', label: 'Waiting for Food', icon: 'hourglass_top' },
    cooking: { color: 'deep-orange', label: 'Preparing', icon: 'local_fire_department' },
    dining: { color: 'teal', label: 'Dining', icon: 'restaurant' },
    reserved: { color: 'purple', label: 'Reserved', icon: 'event_seat' },
    cleaning: { color: 'grey', label: 'Cleaning', icon: 'cleaning_services' },
  }

  // Session log for analytics
  const sessionLog = ref([])

  // ── Computed ──
  const availableTables = computed(() => tables.value.filter((t) => t.status === 'available'))
  const occupiedTables = computed(() =>
    tables.value.filter((t) => ['occupied', 'waiting', 'cooking', 'dining'].includes(t.status)),
  )
  const activeSessions = computed(() => tables.value.filter((t) => t.sessionId !== null))

  // ── Methods ──
  function getTable(num) {
    return tables.value.find((t) => t.number === num)
  }

  // Phase 1: QR Scan — customer scans table QR
  function scanTable(tableNumber) {
    const table = getTable(tableNumber)
    if (!table) return null

    const sessionId = `sess_${Date.now()}_${tableNumber}`
    table.status = 'browsing'
    table.sessionId = sessionId
    table.scannedAt = new Date()

    sessionLog.value.unshift({
      type: 'scan',
      table: tableNumber,
      sessionId,
      timestamp: new Date(),
    })

    return { table, sessionId }
  }

  // Phase 2: Order placed — update table status
  function orderPlaced(tableNumber, orderId) {
    const table = getTable(tableNumber)
    if (!table) return

    table.status = 'waiting'
    table.currentOrder = orderId

    sessionLog.value.unshift({
      type: 'order_placed',
      table: tableNumber,
      orderId,
      timestamp: new Date(),
    })
  }

  // Phase 3: Chef starts cooking
  function startCooking(tableNumber) {
    const table = getTable(tableNumber)
    if (table) table.status = 'cooking'
  }

  // Phase 4: Order ready → served
  function orderReady(tableNumber) {
    const table = getTable(tableNumber)
    if (table) table.status = 'dining'
  }

  // Mark as served/complete
  function orderServed(tableNumber) {
    const table = getTable(tableNumber)
    if (table) {
      table.status = 'available'
      table.currentOrder = null
      table.sessionId = null
      table.scannedAt = null
    }
  }

  function setStatus(tableNumber, status) {
    const table = getTable(tableNumber)
    if (table) table.status = status
  }

  function addTable(tableData) {
    tables.value.push({
      number: tableData.number,
      capacity: tableData.capacity,
      status: 'available',
      currentOrder: null,
      sessionId: null,
      scannedAt: null,
    })
  }

  return {
    tables,
    statusConfig,
    sessionLog,
    availableTables,
    occupiedTables,
    activeSessions,
    getTable,
    scanTable,
    orderPlaced,
    startCooking,
    orderReady,
    orderServed,
    setStatus,
    addTable,
  }
})
