import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const tableId = ref(null)

  const totalItems = computed(() => items.value.reduce((s, i) => s + i.quantity, 0))
  const subtotal = computed(() => items.value.reduce((s, i) => s + i.price * i.quantity, 0))
  const serviceFee = computed(() => Math.round(subtotal.value * 0.1))
  const total = computed(() => subtotal.value + serviceFee.value)

  function addItem(menuItem, notes = '') {
    const existing = items.value.find((i) => i.id === menuItem.id && i.notes === notes)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...menuItem, quantity: 1, notes, cartId: Date.now() + Math.random() })
    }
  }

  function removeItem(cartId) {
    items.value = items.value.filter((i) => i.cartId !== cartId)
  }

  function updateQuantity(cartId, qty) {
    const item = items.value.find((i) => i.cartId === cartId)
    if (item) {
      if (qty <= 0) removeItem(cartId)
      else item.quantity = qty
    }
  }

  function clearCart() {
    items.value = []
  }
  function setTable(id) {
    tableId.value = id
  }

  return {
    items,
    tableId,
    totalItems,
    subtotal,
    serviceFee,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setTable,
  }
})
