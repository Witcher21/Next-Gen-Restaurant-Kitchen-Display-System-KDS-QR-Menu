<template>
  <q-page class="kds-page">
    <!-- New Order Banner (flashes when new order arrives) -->
    <transition name="flash">
      <div v-if="showNewOrderBanner" class="new-order-banner">
        <q-icon name="notifications_active" size="24px" class="q-mr-sm pulse-icon" />
        <span class="text-weight-bold">🔔 NEW ORDER!</span>
        <span class="q-ml-sm">{{ lastNewOrderText }}</span>
      </div>
    </transition>

    <div class="kds-toolbar q-px-lg q-py-sm">
      <q-btn-toggle
        v-model="filter"
        no-caps
        rounded
        unelevated
        toggle-color="orange-9"
        text-color="grey-5"
        :options="[
          {
            label: `All (${orderStore.kdsOrders.filter((o) => o.status !== 'served').length})`,
            value: 'all',
          },
          { label: `⏳ Pending (${pendingCount})`, value: 'pending' },
          { label: `🔥 Cooking (${cookingCount})`, value: 'cooking' },
          { label: `✅ Ready (${readyCount})`, value: 'ready' },
        ]"
        class="filter-toggle"
      />
      <q-space />
      <!-- Live Clock -->
      <span
        class="text-grey-5 q-mr-md"
        style="font-family: 'Space Grotesk', monospace; font-size: 0.85rem"
      >
        {{ currentTime }}
      </span>
      <q-btn
        flat
        round
        :icon="soundEnabled ? 'volume_up' : 'volume_off'"
        :color="soundEnabled ? 'orange' : 'grey-7'"
        @click="soundEnabled = !soundEnabled"
      >
        <q-tooltip>{{ soundEnabled ? 'Sound ON' : 'Sound OFF' }}</q-tooltip>
      </q-btn>
      <q-btn flat round icon="fullscreen" color="grey-5" @click="toggleFullscreen">
        <q-tooltip>Fullscreen</q-tooltip>
      </q-btn>
    </div>

    <div class="kds-grid q-pa-md">
      <TransitionGroup name="ticket">
        <OrderTicket
          v-for="order in filteredOrders"
          :key="order.id"
          :order="order"
          @update-status="handleStatusUpdate"
        />
      </TransitionGroup>
      <div v-if="filteredOrders.length === 0" class="empty-kds">
        <q-icon name="restaurant" size="80px" color="grey-8" />
        <p class="text-grey-6 q-mt-lg text-h6">No {{ filter === 'all' ? '' : filter }} orders</p>
        <p class="text-grey-7">Orders will appear here in real-time with sound alerts</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useSmartDineEngine } from 'stores/smartdine-engine'
import { playNewOrderSound } from 'src/utils/sound-manager'
import OrderTicket from 'components/kds/OrderTicket.vue'

const orderStore = useOrderStore()
const engine = useSmartDineEngine()
const filter = ref('all')
const soundEnabled = ref(true)
const showNewOrderBanner = ref(false)
const lastNewOrderText = ref('')
const currentTime = ref('')

// Live clock
let clockTimer = null
onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})
onUnmounted(() => clearInterval(clockTimer))

function updateClock() {
  currentTime.value = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Live counters
const pendingCount = computed(
  () => orderStore.kdsOrders.filter((o) => o.status === 'pending').length,
)
const cookingCount = computed(
  () => orderStore.kdsOrders.filter((o) => o.status === 'cooking').length,
)
const readyCount = computed(() => orderStore.kdsOrders.filter((o) => o.status === 'ready').length)

const filteredOrders = computed(() => {
  if (filter.value === 'all') return orderStore.kdsOrders.filter((o) => o.status !== 'served')
  return orderStore.kdsOrders.filter((o) => o.status === filter.value)
})

// 🔊 Watch for new orders → play sound + show banner
let previousOrderCount = orderStore.kdsOrders.length
watch(
  () => orderStore.kdsOrders.length,
  (newCount) => {
    if (newCount > previousOrderCount && soundEnabled.value) {
      // New order detected!
      playNewOrderSound()
      const newestOrder = orderStore.kdsOrders[orderStore.kdsOrders.length - 1]
      if (newestOrder) {
        lastNewOrderText.value = `${newestOrder.id} — Table ${newestOrder.tableNumber} (${newestOrder.items.length} items)`
      }
      showNewOrderBanner.value = true
      setTimeout(() => {
        showNewOrderBanner.value = false
      }, 5000)
    }
    previousOrderCount = newCount
  },
)

function handleStatusUpdate({ orderId, status }) {
  if (status === 'cooking') engine.startCooking(orderId)
  else if (status === 'ready') engine.markReady(orderId)
  else if (status === 'served') engine.markServed(orderId)
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen()
  else document.exitFullscreen()
}
</script>

<style lang="scss" scoped>
.kds-page {
  background: #0c0a09;
  min-height: 100vh;
}

.new-order-banner {
  position: sticky;
  top: 0;
  z-index: 20;
  background: linear-gradient(135deg, #ea580c, #f59e0b);
  color: white;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  animation: bannerGlow 1s ease-in-out infinite alternate;
}
@keyframes bannerGlow {
  from {
    box-shadow: 0 4px 20px rgba(234, 88, 12, 0.4);
  }
  to {
    box-shadow: 0 4px 40px rgba(245, 158, 11, 0.7);
  }
}
.pulse-icon {
  animation: pulse 0.6s ease-in-out infinite alternate;
}
@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.3);
  }
}

.flash-enter-active {
  animation: slideDown 0.4s ease-out;
}
.flash-leave-active {
  animation: slideDown 0.3s ease-in reverse;
}
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.kds-toolbar {
  display: flex;
  align-items: center;
  background: rgba(12, 10, 9, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}
.filter-toggle {
  :deep(.q-btn) {
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 16px;
  }
}
.kds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (min-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
  }
}
.empty-kds {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 20px;
}
.ticket-enter-active {
  animation: fadeInUp 0.4s ease-out;
}
.ticket-leave-active {
  animation: fadeInUp 0.3s ease-in reverse;
}
</style>
