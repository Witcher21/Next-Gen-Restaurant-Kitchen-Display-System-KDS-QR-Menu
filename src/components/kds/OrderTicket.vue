<template>
  <q-card class="order-ticket" :class="ticketClass" dark flat>
    <!-- Header -->
    <div class="ticket-header" :class="'ticket-header--' + order.status">
      <div>
        <span class="ticket-id">{{ order.id }}</span>
        <span class="status-badge q-ml-sm" :class="'status-badge--' + order.status">{{
          order.status
        }}</span>
      </div>
      <div class="ticket-table">
        <q-icon name="table_restaurant" size="16px" class="q-mr-xs" />
        Table {{ order.tableNumber }}
      </div>
    </div>

    <!-- Timer -->
    <div class="ticket-timer" :class="timerClass">
      <q-icon name="timer" size="16px" class="q-mr-xs" />
      {{ elapsedTime }}
    </div>

    <!-- Items -->
    <q-list class="ticket-items" dark dense>
      <q-item v-for="(item, i) in order.items" :key="i" class="ticket-item">
        <q-item-section side class="ticket-qty">
          <span>{{ item.quantity }}×</span>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-bold" style="font-size: 0.9rem">{{
            item.name
          }}</q-item-label>
          <q-item-label v-if="item.notes" caption class="text-amber-4"
            >📝 {{ item.notes }}</q-item-label
          >
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Actions -->
    <div class="ticket-actions">
      <q-btn
        v-if="order.status === 'pending'"
        class="full-width"
        rounded
        unelevated
        no-caps
        color="blue-8"
        icon="local_fire_department"
        label="Start Cooking"
        @click="$emit('update-status', { orderId: order.id, status: 'cooking' })"
      />
      <q-btn
        v-else-if="order.status === 'cooking'"
        class="full-width"
        rounded
        unelevated
        no-caps
        color="green-8"
        icon="check_circle"
        label="Ready!"
        @click="$emit('update-status', { orderId: order.id, status: 'ready' })"
      />
      <q-btn
        v-else-if="order.status === 'ready'"
        class="full-width"
        rounded
        unelevated
        no-caps
        color="grey-8"
        icon="done_all"
        label="Served"
        @click="$emit('update-status', { orderId: order.id, status: 'served' })"
      />
    </div>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({ order: { type: Object, required: true } })
defineEmits(['update-status'])

const now = ref(Date.now())
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})
onUnmounted(() => clearInterval(timer))

const elapsedMinutes = computed(() =>
  Math.floor((now.value - new Date(props.order.createdAt).getTime()) / 60000),
)

const elapsedTime = computed(() => {
  const mins = elapsedMinutes.value
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
})

const timerClass = computed(() => {
  const m = elapsedMinutes.value
  if (m > 15) return 'timer--danger'
  if (m > 10) return 'timer--warning'
  return 'timer--ok'
})

const ticketClass = computed(() => {
  if (
    elapsedMinutes.value > 15 &&
    props.order.status !== 'ready' &&
    props.order.status !== 'served'
  )
    return 'ticket--urgent'
  return ''
})
</script>

<style lang="scss" scoped>
.order-ticket {
  background: #1c1917;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.12);
  }
  &.ticket--urgent {
    border-color: rgba(239, 68, 68, 0.4);
    animation: pulseGlow 2s infinite;
    --pulse-color: rgba(239, 68, 68, 0.3);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 8px var(--pulse-color, rgba(234, 88, 12, 0.3));
  }
  50% {
    box-shadow: 0 0 24px var(--pulse-color, rgba(234, 88, 12, 0.6));
  }
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);

  &--pending {
    border-left: 4px solid #f59e0b;
  }
  &--cooking {
    border-left: 4px solid #3b82f6;
  }
  &--ready {
    border-left: 4px solid #22c55e;
  }
  &--served {
    border-left: 4px solid #78716c;
  }
}

.ticket-id {
  font-family: 'Space Grotesk', monospace;
  font-weight: 800;
  font-size: 1rem;
}

.ticket-table {
  font-size: 0.8rem;
  color: #a8a29e;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.ticket-timer {
  padding: 8px 16px;
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  font-family: 'Space Grotesk', monospace;

  &.timer--ok {
    color: #22c55e;
    background: rgba(34, 197, 94, 0.05);
  }
  &.timer--warning {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.08);
  }
  &.timer--danger {
    color: #ef4444;
    background: rgba(239, 68, 68, 0.08);
  }
}

.ticket-items {
  padding: 8px 0;
}
.ticket-item {
  min-height: 36px;
}
.ticket-qty {
  min-width: 32px;
  span {
    font-family: 'Space Grotesk', monospace;
    font-weight: 800;
    font-size: 0.9rem;
    color: #ea580c;
  }
}

.ticket-actions {
  padding: 12px 16px;
}
</style>
