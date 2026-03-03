import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('order', () => {
  const orders = ref([])
  const currentOrder = ref(null)

  const kdsOrders = ref([
    {
      id: 'ORD-001',
      tableNumber: 5,
      items: [
        { name: 'Chicken Kottu', quantity: 2, notes: 'Extra spicy' },
        { name: 'Cheese Burger', quantity: 1, notes: '' },
        { name: 'Fresh Lime Juice', quantity: 2, notes: 'Less sugar' },
      ],
      status: 'pending',
      createdAt: new Date(Date.now() - 2 * 60000),
      totalAmount: 2830,
    },
    {
      id: 'ORD-002',
      tableNumber: 3,
      items: [
        { name: 'Chicken Biryani', quantity: 1, notes: '' },
        { name: 'Garlic Butter Prawns', quantity: 1, notes: '' },
        { name: 'Mango Smoothie', quantity: 2, notes: '' },
      ],
      status: 'cooking',
      createdAt: new Date(Date.now() - 8 * 60000),
      totalAmount: 3190,
    },
    {
      id: 'ORD-003',
      tableNumber: 8,
      items: [
        { name: 'Traditional Rice & Curry', quantity: 3, notes: 'No coconut sambol for 1' },
        { name: 'King Coconut', quantity: 3, notes: '' },
      ],
      status: 'cooking',
      createdAt: new Date(Date.now() - 14 * 60000),
      totalAmount: 3180,
    },
    {
      id: 'ORD-004',
      tableNumber: 1,
      items: [
        { name: 'Creamy Carbonara', quantity: 2, notes: '' },
        { name: 'Iced Coffee', quantity: 2, notes: '' },
      ],
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 60000),
      totalAmount: 2800,
    },
    {
      id: 'ORD-005',
      tableNumber: 12,
      items: [
        { name: 'Grilled Fish Steak', quantity: 1, notes: 'Well done' },
        { name: 'Devilled Prawns', quantity: 1, notes: 'Medium spicy' },
        { name: 'Chocolate Lava Cake', quantity: 2, notes: '' },
      ],
      status: 'ready',
      createdAt: new Date(Date.now() - 20 * 60000),
      totalAmount: 4160,
    },
  ])

  function placeOrder(cartItems, tableNumber, totalAmount, customerSessionId = null) {
    const order = {
      id: `ORD-${String(orders.value.length + 6).padStart(3, '0')}`,
      tableNumber,
      items: cartItems.map((i) => ({ name: i.name, quantity: i.quantity, notes: i.notes || '' })),
      status: 'pending',
      createdAt: new Date(),
      totalAmount,
      customerSessionId, // 🆔 Link order to customer session
    }
    orders.value.push(order)
    currentOrder.value = order
    kdsOrders.value.unshift(order)
    return order
  }

  function updateOrderStatus(orderId, status) {
    const o = kdsOrders.value.find((x) => x.id === orderId)
    if (o) o.status = status
    const c = orders.value.find((x) => x.id === orderId)
    if (c) c.status = status
    if (currentOrder.value?.id === orderId) currentOrder.value.status = status
  }

  const pendingOrders = computed(() => kdsOrders.value.filter((o) => o.status === 'pending'))
  const cookingOrders = computed(() => kdsOrders.value.filter((o) => o.status === 'cooking'))
  const readyOrders = computed(() => kdsOrders.value.filter((o) => o.status === 'ready'))

  // Get orders for a specific customer session
  function getOrdersBySession(sessionId) {
    return orders.value.filter((o) => o.customerSessionId === sessionId)
  }

  // Get orders for a specific table (for customers who don't have session yet)
  function getOrdersByTable(tableNumber) {
    return kdsOrders.value.filter((o) => o.tableNumber === tableNumber)
  }

  return {
    orders,
    currentOrder,
    kdsOrders,
    placeOrder,
    updateOrderStatus,
    getOrdersBySession,
    getOrdersByTable,
    pendingOrders,
    cookingOrders,
    readyOrders,
  }
})
