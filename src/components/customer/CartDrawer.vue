<template>
  <q-drawer
    v-model="drawerModel"
    side="right"
    :width="380"
    overlay
    bordered
    class="premium-cart-drawer"
    dark
  >
    <div class="drawer-content">
      <!-- Header -->
      <div class="drawer-header">
        <div class="row items-center">
          <q-icon name="shopping_bag" size="28px" color="orange" />
          <span class="drawer-title q-ml-sm">Your Order</span>
          <div v-if="cartStore.totalItems > 0" class="cart-pill q-ml-md">
            {{ cartStore.totalItems }} items
          </div>
        </div>
        <q-btn flat round dense icon="close" class="btn-close" @click="drawerModel = false" />
      </div>

      <!-- Empty State -->
      <div v-if="cartStore.items.length === 0" class="empty-cart animate-fade-in-up">
        <div class="empty-icon-wrapper">
          <q-icon name="restaurant" class="empty-icon" />
        </div>
        <h3 class="empty-title">Your cart feels light</h3>
        <p class="empty-sub">Explore our menu and discover something delicious.</p>
        <q-btn
          rounded
          unelevated
          no-caps
          color="orange"
          outline
          label="Browse Menu"
          class="q-mt-lg"
          @click="drawerModel = false"
        />
      </div>

      <!-- Cart Items -->
      <q-scroll-area v-else class="cart-items-area" :thumb-style="{ width: '4px', opacity: 0.2 }">
        <div class="q-pa-md q-pt-lg">
          <TransitionGroup name="list">
            <div
              v-for="item in cartStore.items"
              :key="item.cartId"
              class="cart-item glass-card-dark q-mb-md"
            >
              <div class="row items-start no-wrap q-pa-md">
                <div class="cart-item__img" :style="{ background: item.gradient }">
                  <span class="cart-item__emoji">{{ item.emoji }}</span>
                  <div class="cart-item__img-overlay"></div>
                </div>

                <div class="col q-ml-md flex column justify-between">
                  <div>
                    <div class="cart-item__name">{{ item.name }}</div>
                    <div v-if="item.notes" class="cart-item__notes">
                      <q-icon name="edit_note" color="orange" size="14px" /> {{ item.notes }}
                    </div>
                  </div>
                  <div class="price-val q-mt-sm">
                    Rs. {{ (item.price * item.quantity).toLocaleString() }}
                  </div>
                </div>

                <q-btn
                  flat
                  round
                  dense
                  icon="delete_outline"
                  size="sm"
                  class="btn-delete"
                  @click="cartStore.removeItem(item.cartId)"
                />
              </div>

              <!-- Quantity Controls -->
              <div class="qty-control-wrapper row items-center justify-between q-px-md q-pb-md">
                <span class="qty-label">Quantity</span>
                <div class="qty-controls">
                  <q-btn
                    round
                    dense
                    unelevated
                    icon="remove"
                    class="qty-btn"
                    @click="cartStore.updateQuantity(item.cartId, item.quantity - 1)"
                  />
                  <span class="qty-val">{{ item.quantity }}</span>
                  <q-btn
                    round
                    dense
                    unelevated
                    icon="add"
                    class="qty-btn qty-btn--add"
                    @click="cartStore.updateQuantity(item.cartId, item.quantity + 1)"
                  />
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </q-scroll-area>

      <!-- Summary & Checkout (Sticky Bottom) -->
      <div v-if="cartStore.items.length > 0" class="cart-summary glass-panel-dark">
        <div class="summary-details q-mb-md">
          <div class="summary-row">
            <span class="summary-label">Subtotal</span>
            <span class="summary-val">Rs. {{ cartStore.subtotal.toLocaleString() }}</span>
          </div>
          <div class="summary-row q-mt-xs">
            <span class="summary-label">Service Fee (10%)</span>
            <span class="summary-val">Rs. {{ cartStore.serviceFee.toLocaleString() }}</span>
          </div>
          <div class="summary-divider q-my-md"></div>
          <div class="summary-row summary-row--total">
            <span class="total-label">Total to pay</span>
            <span class="total-val text-gradient">Rs. {{ cartStore.total.toLocaleString() }}</span>
          </div>
        </div>

        <q-btn
          class="btn-checkout full-width shadow-glow"
          rounded
          unelevated
          size="lg"
          no-caps
          @click="placeOrder"
        >
          <div class="row items-center justify-between full-width">
            <span>Place Order</span>
            <div class="checkout-arrow"><q-icon name="arrow_forward" /></div>
          </div>
        </q-btn>
      </div>
    </div>
  </q-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useCartStore } from 'stores/cart-store'
import { useSmartDineEngine } from 'stores/smartdine-engine'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])
const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const engine = useSmartDineEngine()

const drawerModel = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

function placeOrder() {
  const tableId = Number(route.params.tableId) || cartStore.tableId || 1

  const { order, deductions, alerts } = engine.processOrder(tableId)

  emit('update:modelValue', false)

  let captionHtml = `<div style="opacity: 0.9; margin-top: 4px;">Table ${tableId} • Order #${order.id}</div>`
  if (deductions.length > 0 || alerts.length > 0) {
    captionHtml += `<div style="font-size: 11px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 4px; color: #a3a3a3;">`
    if (deductions.length > 0) captionHtml += `✓ Kitchen sync: ${deductions.length} items<br/>`
    if (alerts.length > 0) captionHtml += `⚠️ Low stock alerts: ${alerts.length}`
    captionHtml += `</div>`
  }

  $q.notify({
    message: `<div style="display:flex; align-items:flex-start; gap:12px">
                <div style="font-size:28px; line-height:1">✅</div>
                <div>
                  <div style="font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:16px;">Order Placed!</div>
                  ${captionHtml}
                </div>
              </div>`,
    html: true,
    color: 'dark',
    position: 'top',
    timeout: 5000,
    classes: 'glass-toast border-positive',
  })

  router.push({ name: 'orders', params: { tableId } })
}
</script>

<style lang="scss" scoped>
/* Core Drawer Layout */
.premium-cart-drawer {
  background: rgba(10, 10, 10, 0.95) !important;
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px);
  border-left: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
  font-family: 'Inter', sans-serif;
}

/* Header */
.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.drawer-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.3rem;
  letter-spacing: -0.5px;
}
.cart-pill {
  background: rgba(234, 88, 12, 0.15);
  color: #ea580c;
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(234, 88, 12, 0.3);
}
.btn-close {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #a3a3a3;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1) !important;
    color: #fff;
  }
}

/* Empty State */
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
}
.empty-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.empty-icon {
  font-size: 32px;
  color: #525252;
}
.empty-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 8px;
  color: #e5e5e5;
}
.empty-sub {
  color: #737373;
  font-size: 0.9rem;
  max-width: 240px;
  margin: 0;
}

/* Items Area */
.cart-items-area {
  flex: 1;
}
.glass-card-dark {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.cart-item {
  &__img {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  &__emoji {
    font-size: 36px;
    z-index: 2;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
  }
  &__img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    z-index: 1;
  }

  &__name {
    font-weight: 700;
    font-size: 1rem;
    color: #f5f5f5;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  &__notes {
    font-size: 0.75rem;
    color: #ea580c;
    margin-top: 6px;
    background: rgba(234, 88, 12, 0.1);
    padding: 4px 8px;
    border-radius: 6px;
    display: inline-block;
  }
}

.price-val {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #a3a3a3;
}
.btn-delete {
  color: #ef4444;
  opacity: 0.5;
  transition: opacity 0.2s;
  &:hover {
    opacity: 1;
    background: rgba(239, 68, 68, 0.1) !important;
  }
}

/* Quantity Controls */
.qty-control-wrapper {
  border-top: 1px dashed rgba(255, 255, 255, 0.05);
  padding-top: 12px;
  margin-top: -8px;
}
.qty-label {
  font-size: 0.75rem;
  color: #737373;
  font-weight: 500;
}
.qty-controls {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 100px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.qty-btn {
  width: 28px;
  height: 28px;
  font-size: 10px;
  color: #a3a3a3;
  background: transparent !important;
}
.qty-btn--add {
  background: #ea580c !important;
  color: white;
}
.qty-val {
  width: 32px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}

/* Sticky Summary Footer */
.cart-summary {
  padding: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(10, 10, 10, 0.95);
  z-index: 10;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-label {
  color: #a3a3a3;
  font-size: 0.95rem;
}
.summary-val {
  font-weight: 600;
  font-size: 0.95rem;
}
.summary-divider {
  height: 1px;
  background: dashed 1px rgba(255, 255, 255, 0.1);
  width: 100%;
}

.summary-row--total {
  align-items: flex-end;
}
.total-label {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: #f5f5f5;
}
.total-val {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 1.5rem;
}
.text-gradient {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.btn-checkout {
  background: linear-gradient(135deg, #22c55e, #10b981) !important;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 24px;
  height: 64px;
  padding: 0 8px 0 24px;
  transition: all 0.3s ease;
  .checkout-arrow {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(34, 197, 94, 0.4);
  }
}

/* Animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.list-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease both;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

<style lang="scss">
/* Global styles for the toast notification inserted from scripts */
.glass-toast {
  background: rgba(20, 20, 20, 0.8) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
}
.border-positive {
  border-left: 4px solid #22c55e !important;
}
</style>
