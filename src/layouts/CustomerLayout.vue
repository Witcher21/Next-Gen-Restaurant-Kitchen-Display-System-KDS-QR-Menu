<template>
  <q-layout view="hHh lpr fFf">
    <q-header class="customer-header">
      <q-toolbar class="q-px-md">
        <div class="row items-center no-wrap">
          <span class="header-logo gradient-text text-weight-bold">SmartDine</span>
          <q-badge color="orange-9" class="q-ml-sm" rounded>
            Table {{ $route.params.tableId }}
          </q-badge>
          <q-badge
            v-if="sessionStore.sessionId"
            color="grey-8"
            class="q-ml-xs"
            rounded
            style="font-family: 'Space Grotesk', monospace; font-size: 0.65rem"
          >
            {{ sessionStore.sessionId }}
          </q-badge>
        </div>
        <q-space />
        <q-btn flat round icon="search" color="white" size="sm" @click="searchOpen = !searchOpen" />
        <!-- Quick Nav: KDS + Admin (ONLY visible when admin is logged in) -->
        <template v-if="adminAuth.isLoggedIn">
          <q-btn
            flat
            round
            icon="soup_kitchen"
            color="grey-5"
            size="sm"
            class="q-ml-xs"
            :to="{ name: 'kds' }"
          >
            <q-tooltip>Kitchen Display</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            icon="admin_panel_settings"
            color="grey-5"
            size="sm"
            class="q-ml-xs"
            :to="{ name: 'admin-dashboard' }"
          >
            <q-tooltip>Admin Panel</q-tooltip>
          </q-btn>
        </template>
      </q-toolbar>
      <q-slide-transition>
        <div v-show="searchOpen" class="q-px-md q-pb-sm">
          <q-input
            v-model="searchQuery"
            dark
            dense
            outlined
            rounded
            placeholder="Search menu..."
            class="search-input"
            @update:model-value="menuStore.setSearch($event)"
          >
            <template v-slot:prepend><q-icon name="search" size="xs" /></template>
            <template v-slot:append v-if="searchQuery">
              <q-icon name="close" size="xs" class="cursor-pointer" @click="clearSearch" />
            </template>
          </q-input>
        </div>
      </q-slide-transition>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="customer-footer">
      <q-tabs
        v-model="activeTab"
        active-color="orange"
        indicator-color="orange"
        class="footer-tabs"
        narrow-indicator
        dense
        switch-indicator
      >
        <q-route-tab
          name="menu"
          icon="restaurant_menu"
          label="Menu"
          :to="{ name: 'menu', params: { tableId: $route.params.tableId } }"
        />
        <q-route-tab
          name="cart"
          icon="shopping_cart"
          label="Cart"
          :to="{ name: 'menu', params: { tableId: $route.params.tableId } }"
          @click="$emit('toggle-cart')"
        >
          <q-badge v-if="cartStore.totalItems > 0" color="red" floating rounded>{{
            cartStore.totalItems
          }}</q-badge>
        </q-route-tab>
        <q-route-tab
          name="orders"
          icon="receipt_long"
          label="Orders"
          :to="{ name: 'orders', params: { tableId: $route.params.tableId } }"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from 'stores/menu-store'
import { useCartStore } from 'stores/cart-store'
import { useSmartDineEngine } from 'stores/smartdine-engine'
import { useCustomerSessionStore } from 'stores/customer-session-store'
import { useAdminAuthStore } from 'stores/admin-auth-store'
import { useQuasar } from 'quasar'

const route = useRoute()
const menuStore = useMenuStore()
const cartStore = useCartStore()
const engine = useSmartDineEngine()
const sessionStore = useCustomerSessionStore()
const adminAuth = useAdminAuthStore()
const $q = useQuasar()
const activeTab = ref('menu')
const searchOpen = ref(false)
const searchQuery = ref('')

// Restore admin session if saved
adminAuth.tryAutoRestore()

// 🔥 PHASE 1: QR SCAN — Register table scan + welcome
onMounted(() => {
  const tableId = Number(route.params.tableId)
  if (tableId) {
    engine.scanTable(tableId)
    cartStore.setTable(tableId)

    $q.notify({
      message: `Welcome! You are at Table ${tableId}`,
      caption: sessionStore.sessionId
        ? `Session: ${sessionStore.sessionId}`
        : 'Browse the menu and place your order',
      color: 'orange-9',
      position: 'top',
      timeout: 3000,
      icon: 'restaurant',
    })
  }
})

function clearSearch() {
  searchQuery.value = ''
  menuStore.setSearch('')
}
</script>

<style lang="scss" scoped>
.customer-header {
  background: rgba(12, 10, 9, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}
.header-logo {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.3rem;
}
.search-input {
  :deep(.q-field__control) {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
}
.customer-footer {
  background: rgba(12, 10, 9, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.footer-tabs {
  :deep(.q-tab__label) {
    font-size: 10px;
    font-weight: 600;
  }
  :deep(.q-tab__icon) {
    font-size: 20px;
  }
}
</style>
