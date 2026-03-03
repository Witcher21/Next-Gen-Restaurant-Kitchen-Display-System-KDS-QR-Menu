<template>
  <q-page class="premium-tracking-page">
    <div class="page-container">
      <!-- Premium Header -->
      <div class="tracking-hero animate-fade-in-down">
        <div class="hero-bg"></div>
        <div class="hero-content row items-center no-wrap">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            color="white"
            class="btn-back shadow-soft q-mr-md"
            @click="$router.push({ name: 'menu', params: { tableId: $route.params.tableId } })"
          />
          <div class="header-text">
            <h1 class="hero-title">Your Orders</h1>
            <p class="hero-subtitle">
              Table {{ $route.params.tableId }}
              <span v-if="sessionStore.sessionId" class="session-pill q-ml-sm">
                <q-icon name="vpn_key" size="12px" class="q-mr-xs" /> {{ sessionStore.sessionId }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-wrapper">
        <!-- Empty State -->
        <div v-if="myOrders.length === 0" class="empty-state animate-fade-in-up delay-1">
          <div class="empty-icon-wrapper animate-float">
            <span class="empty-emoji">🧾</span>
          </div>
          <h2 class="empty-title">No orders yet</h2>
          <p class="empty-sub">
            Your culinary journey awaits. Add items from the menu to see them here.
          </p>
          <q-btn
            rounded
            unelevated
            no-caps
            size="lg"
            color="orange-9"
            class="start-btn shadow-glow q-mt-lg"
            :to="{ name: 'menu', params: { tableId: $route.params.tableId } }"
          >
            <q-icon name="restaurant_menu" class="q-mr-sm" /> Explore Menu
          </q-btn>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
          <TransitionGroup name="list">
            <div
              v-for="(order, idx) in myOrders.slice().reverse()"
              :key="order.id"
              class="premium-order-card glass-card-dark q-mb-xl animate-fade-in-up"
              :style="`animation-delay: ${idx * 0.15}s`"
            >
              <!-- Order Header -->
              <div class="card-header row items-center justify-between">
                <div>
                  <div class="order-id-label">Order ID</div>
                  <div class="order-id-val">{{ order.id }}</div>
                </div>
                <div class="text-right">
                  <div class="status-pill" :class="`status-pill--${order.status}`">
                    <q-icon :name="getStatusIcon(order.status)" size="14px" class="q-mr-xs" />
                    {{ order.status.toUpperCase() }}
                  </div>
                  <div class="order-time q-mt-xs">{{ formatTime(order.createdAt) }}</div>
                </div>
              </div>

              <!-- Animated Status Stepper -->
              <div class="stepper-container q-py-lg">
                <div class="stepper-track">
                  <div
                    class="stepper-progress"
                    :style="{ width: getProgressWidth(order.status) }"
                  ></div>
                </div>
                <div class="stepper-steps">
                  <div
                    v-for="(step, si) in statusSteps"
                    :key="step.value"
                    class="step-item"
                    :class="{
                      'step-item--done': getStepIndex(order.status) > si,
                      'step-item--active': getStepIndex(order.status) === si,
                    }"
                  >
                    <div class="step-icon-wrapper">
                      <q-icon
                        v-if="getStepIndex(order.status) > si"
                        name="check"
                        size="14px"
                        color="white"
                      />
                      <div v-else-if="getStepIndex(order.status) === si" class="active-dot"></div>
                    </div>
                    <div class="step-label">{{ step.label }}</div>
                  </div>
                </div>
              </div>

              <!-- Order Items List -->
              <div class="items-container q-px-lg q-pb-md">
                <h3 class="items-title q-mb-sm">Order Summary</h3>
                <div class="items-list">
                  <div v-for="(item, i) in order.items" :key="i" class="item-row">
                    <div class="item-qty-badge">{{ item.quantity }}x</div>
                    <div class="col q-pl-sm">
                      <div class="item-name">{{ item.name }}</div>
                      <div v-if="item.notes" class="item-notes">
                        <q-icon name="edit_note" /> {{ item.notes }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card Footer -->
              <div class="card-footer row items-end justify-between q-pa-lg">
                <div class="total-label">Subtotal Component</div>
                <div class="total-val text-gradient">
                  Rs. {{ order.totalAmount.toLocaleString() }}
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useCustomerSessionStore } from 'stores/customer-session-store'

const orderStore = useOrderStore()
const sessionStore = useCustomerSessionStore()

const myOrders = computed(() => {
  if (sessionStore.sessionId) {
    return orderStore.getOrdersBySession(sessionStore.sessionId)
  }
  return orderStore.orders
})

const statusSteps = [
  { value: 'pending', label: 'Placed' },
  { value: 'cooking', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
]

function getStepIndex(status) {
  return statusSteps.findIndex((s) => s.value === status)
}

function getProgressWidth(status) {
  const index = getStepIndex(status)
  if (index === 0) return '0%'
  if (index === 1) return '33%'
  if (index === 2) return '66%'
  return '100%'
}

function getStatusIcon(status) {
  switch (status) {
    case 'pending':
      return 'receipt_long'
    case 'cooking':
      return 'soup_kitchen'
    case 'ready':
      return 'room_service'
    case 'served':
      return 'check_circle'
    default:
      return 'info'
  }
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style lang="scss" scoped>
/* Page Layout */
.premium-tracking-page {
  background: #050505;
  color: #fff;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}
.page-container {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 80px;
}

/* Hero Header */
.tracking-hero {
  position: relative;
  padding: 40px 20px 60px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, rgba(234, 88, 12, 0.15) 0%, transparent 60%);
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
}
.btn-back {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(8px);
}
.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 4px;
  line-height: 1.1;
}
.hero-subtitle {
  font-size: 0.95rem;
  color: #a3a3a3;
  margin: 0;
  display: flex;
  align-items: center;
}
.session-pill {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 10px;
  border-radius: 100px;
  font-family: 'Space Grotesk', monospace;
  font-size: 0.75rem;
  color: #d4d4d4;
}

/* Content Area */
.content-wrapper {
  padding: 0 20px;
  margin-top: -20px;
  position: relative;
  z-index: 2;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(25, 25, 25, 0.4);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}
.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
}
.empty-emoji {
  font-size: 48px;
  filter: drop-shadow(0 10px 10px rgba(0, 0, 0, 0.3));
}
.empty-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 12px;
}
.empty-sub {
  color: #a3a3a3;
  max-width: 300px;
  margin: 0 auto;
  line-height: 1.5;
}
.start-btn {
  background: linear-gradient(135deg, #ea580c, #f59e0b) !important;
  font-weight: 700;
}

/* Order Cards */
.glass-card-dark {
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.card-header {
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.order-id-label {
  font-size: 0.75rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}
.order-id-val {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: #fff;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  &--pending {
    background: rgba(168, 162, 158, 0.15);
    color: #a8a29e;
    border: 1px solid rgba(168, 162, 158, 0.3);
  }
  &--cooking {
    background: rgba(245, 158, 11, 0.15);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.3);
  }
  &--ready {
    background: rgba(34, 197, 94, 0.15);
    color: #22c55e;
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  &--served {
    background: rgba(59, 130, 246, 0.15);
    color: #3b82f6;
    border: 1px solid rgba(59, 130, 246, 0.3);
  }
}
.order-time {
  font-size: 0.75rem;
  color: #737373;
  font-family: monospace;
}

/* Custom Stepper */
.stepper-container {
  position: relative;
  padding: 32px 24px;
}
.stepper-track {
  position: absolute;
  top: 48px;
  left: 40px;
  right: 40px;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  z-index: 0;
}
.stepper-progress {
  height: 100%;
  background: linear-gradient(90deg, #ea580c, #f59e0b);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.stepper-steps {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}
.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  .step-icon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 3px solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.4s ease;
    margin-bottom: 12px;
  }
  .step-label {
    font-size: 0.7rem;
    color: #737373;
    font-weight: 600;
    text-align: center;
    transition: color 0.3s;
  }

  &--active {
    .step-icon-wrapper {
      border-color: #ea580c;
      background: rgba(234, 88, 12, 0.1);
      box-shadow: 0 0 16px rgba(234, 88, 12, 0.4);
    }
    .active-dot {
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 50%;
      animation: pulseGlow 1.5s infinite;
    }
    .step-label {
      color: #ea580c;
    }
  }
  &--done {
    .step-icon-wrapper {
      border-color: #f59e0b;
      background: #ea580c;
    }
    .step-label {
      color: #f5f5f5;
    }
  }
}

/* Items List */
.items-container {
  border-top: 1px dashed rgba(255, 255, 255, 0.05);
  padding-top: 20px;
}
.items-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #a3a3a3;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}
.items-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}
.item-row {
  display: flex;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.02);
  padding: 10px 12px;
  border-radius: 12px;
}
.item-qty-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}
.item-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #f5f5f5;
}
.item-notes {
  font-size: 0.75rem;
  color: #f59e0b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-style: italic;
}

/* Footer */
.card-footer {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.03);
}
.total-label {
  color: #737373;
  font-size: 0.85rem;
  font-weight: 500;
}
.total-val {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1;
}
.text-gradient {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Utility / Anim */
.shadow-soft {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.shadow-glow {
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.4);
}
.animate-fade-in-down {
  animation: fadeInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease both;
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
@keyframes pulseGlow {
  0% {
    opacity: 0.5;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
    box-shadow: 0 0 10px #fff;
  }
  100% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Vue Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.list-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}
</style>
