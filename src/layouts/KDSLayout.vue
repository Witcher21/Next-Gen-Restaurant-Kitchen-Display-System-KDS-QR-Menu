<template>
  <q-layout view="hHh lpr fFf">
    <q-header class="kds-header">
      <q-toolbar class="q-px-lg">
        <div class="row items-center no-wrap">
          <q-icon name="restaurant" size="28px" color="orange" class="q-mr-sm" />
          <span class="kds-title">SmartDine <span class="text-orange">KDS</span></span>
        </div>
        <q-space />
        <div class="row items-center q-gutter-md">
          <div class="kds-stat">
            <span class="kds-stat__value text-amber">{{ pendingOrders.length }}</span>
            <span class="kds-stat__label">Pending</span>
          </div>
          <q-separator vertical dark class="q-mx-sm" />
          <div class="kds-stat">
            <span class="kds-stat__value text-blue">{{ cookingOrders.length }}</span>
            <span class="kds-stat__label">Cooking</span>
          </div>
          <q-separator vertical dark class="q-mx-sm" />
          <div class="kds-stat">
            <span class="kds-stat__value text-green">{{ readyOrders.length }}</span>
            <span class="kds-stat__label">Ready</span>
          </div>
          <q-separator vertical dark class="q-mx-md" />
          <div class="kds-clock">{{ currentTime }}</div>
          <q-separator vertical dark class="q-mx-sm" />
          <!-- Quick Nav: Customer + Admin -->
          <q-btn
            flat
            round
            icon="phone_android"
            color="grey-5"
            size="sm"
            :to="{ name: 'menu', params: { tableId: 1 } }"
          >
            <q-tooltip>Customer Menu</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="admin_panel_settings"
            color="grey-5"
            size="sm"
            :to="{ name: 'admin-dashboard' }"
          >
            <q-tooltip>Admin Panel</q-tooltip>
          </q-btn>
          <q-btn flat round icon="logout" color="grey-6" size="sm" @click="handleLogout">
            <q-tooltip>Log Out</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useAdminAuthStore } from 'stores/admin-auth-store'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const orderStore = useOrderStore()
const adminAuth = useAdminAuthStore()
const pendingOrders = computed(() => orderStore.pendingOrders)
const cookingOrders = computed(() => orderStore.cookingOrders)
const readyOrders = computed(() => orderStore.readyOrders)

const currentTime = ref('')
let timer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  // Auth Guard
  adminAuth.tryAutoRestore()
  if (!adminAuth.isLoggedIn) {
    router.replace({ name: 'admin-login', query: { redirect: route.fullPath } })
    return
  }

  updateClock()
  timer = setInterval(updateClock, 1000)
})
onUnmounted(() => clearInterval(timer))

function handleLogout() {
  $q.dialog({
    title: 'Log Out',
    message: 'Are you sure you want to log out from KDS?',
    dark: true,
    cancel: { flat: true, color: 'grey-5', noCaps: true },
    ok: { color: 'red', rounded: true, unelevated: true, noCaps: true, label: 'Log Out' },
  }).onOk(() => {
    adminAuth.logout()
    $q.notify({ type: 'info', message: 'Logged out successfully', icon: 'logout', position: 'top' })
    router.push({ name: 'admin-login' })
  })
}
</script>

<style lang="scss" scoped>
.kds-header {
  background: #0c0a09;
  border-bottom: 2px solid rgba(234, 88, 12, 0.3);
}
.kds-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fafaf9;
}
.kds-stat {
  text-align: center;
  &__value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    display: block;
    line-height: 1;
  }
  &__label {
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #78716c;
    letter-spacing: 0.5px;
  }
}
.kds-clock {
  font-family: 'Space Grotesk', monospace;
  font-size: 1.1rem;
  font-weight: 600;
  color: #a8a29e;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 14px;
  border-radius: 8px;
}
</style>
