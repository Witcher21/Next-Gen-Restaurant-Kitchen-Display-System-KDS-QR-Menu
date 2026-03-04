<template>
  <q-layout view="lHh Lpr lFf" class="premium-admin-layout">
    <!-- Top Header -->
    <q-header class="admin-topbar shadow-soft">
      <q-toolbar class="q-px-lg" style="min-height: 70px">
        <q-btn
          flat
          dense
          round
          icon="menu_open"
          color="grey-5"
          class="menu-btn"
          @click="drawerOpen = !drawerOpen"
        />

        <q-space />

        <!-- Action Buttons -->
        <div class="header-actions row items-center q-gutter-sm">
          <q-btn
            flat
            round
            icon="phone_iphone"
            class="action-btn"
            size="sm"
            :to="{ name: 'menu', params: { tableId: '1' } }"
          >
            <q-tooltip class="glass-tooltip">Customer View</q-tooltip>
          </q-btn>
          <q-btn flat round icon="soup_kitchen" class="action-btn" size="sm" :to="{ name: 'kds' }">
            <q-tooltip class="glass-tooltip">Kitchen Display</q-tooltip>
          </q-btn>

          <div class="separator-dots q-mx-sm"></div>

          <!-- Notifications -->
          <q-btn flat round icon="notifications_none" class="action-btn" size="sm">
            <q-badge v-if="unreadCount > 0" class="pulse-badge" rounded>{{ unreadCount }}</q-badge>
            <q-menu class="premium-menu notif-menu" max-width="380px" :offset="[0, 15]">
              <div class="menu-glass-bg"></div>
              <q-list class="relative-position">
                <q-item-label header class="menu-header row items-center justify-between">
                  <span class="text-white text-weight-bold" style="font-size: 1rem"
                    >Notifications</span
                  >
                  <q-btn
                    v-if="unreadCount > 0"
                    flat
                    dense
                    no-caps
                    size="xs"
                    color="orange"
                    label="Mark all read"
                    @click="markAllRead"
                  />
                </q-item-label>

                <div v-if="notifications.length === 0" class="empty-notifs">
                  <q-icon
                    name="notifications_paused"
                    size="32px"
                    color="grey-7"
                    class="q-mb-sm"
                  /><br />
                  You're all caught up.
                </div>

                <q-item
                  v-for="n in notifications"
                  :key="n.id"
                  clickable
                  v-ripple
                  class="notif-item"
                  :class="{ 'notif-unread': !n.read }"
                  @click="n.read = true"
                >
                  <q-item-section avatar>
                    <div
                      class="notif-icon-wrapper"
                      :style="`color:var(--q-${n.color}); background:rgba(var(--q-${n.color}-rgb),0.15)`"
                    >
                      <q-icon :name="n.icon" size="18px" />
                    </div>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="notif-title">{{ n.title }}</q-item-label>
                    <q-item-label class="notif-msg ellipsis-2-lines">{{ n.message }}</q-item-label>
                    <q-item-label class="notif-time">{{ n.time }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      flat
                      round
                      dense
                      icon="close"
                      size="xs"
                      color="grey-6"
                      class="close-btn"
                      @click.stop="dismissNotif(n.id)"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!-- Profile -->
          <q-btn flat class="profile-btn q-ml-sm q-pl-sm q-pr-xs" no-caps>
            <div class="row items-center no-wrap">
              <div class="text-right q-mr-sm hide-on-mobile">
                <div class="profile-name">{{ adminAuth.adminName || 'Admin' }}</div>
                <div class="profile-role">Super Admin</div>
              </div>
              <q-avatar size="36px" class="profile-avatar shadow-glow">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
                  alt="Admin Avatar"
                />
              </q-avatar>
              <q-icon name="expand_more" size="16px" color="grey-5" class="q-ml-xs" />
            </div>

            <q-menu class="premium-menu profile-menu" min-width="240px" :offset="[0, 15]">
              <div class="menu-glass-bg"></div>
              <q-list class="relative-position q-py-sm">
                <q-item class="q-pb-md text-center column items-center">
                  <q-avatar size="64px" class="q-mb-sm shadow-soft">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
                      alt="Admin Avatar"
                    />
                  </q-avatar>
                  <div
                    class="text-h6 text-white text-weight-bold"
                    style="line-height: 1.2; font-family: 'Space Grotesk', sans-serif"
                  >
                    {{ adminAuth.adminName }}
                  </div>
                  <div class="text-grey-5" style="font-size: 0.75rem">
                    ID: {{ adminAuth.adminId }}
                  </div>
                </q-item>
                <div class="menu-divider"></div>
                <q-item clickable v-ripple v-close-popup class="menu-action-item">
                  <q-item-section avatar
                    ><q-icon name="person_outline" size="20px"
                  /></q-item-section>
                  <q-item-section>My Account</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  :to="{ name: 'admin-settings' }"
                  class="menu-action-item"
                >
                  <q-item-section avatar
                    ><q-icon name="settings_input_component" size="20px"
                  /></q-item-section>
                  <q-item-section>System Settings</q-item-section>
                </q-item>
                <div class="menu-divider"></div>
                <q-item
                  clickable
                  v-ripple
                  v-close-popup
                  @click="handleLogout"
                  class="menu-action-item text-red-5 logout-item"
                >
                  <q-item-section avatar
                    ><q-icon name="logout" size="20px" color="red-5"
                  /></q-item-section>
                  <q-item-section>Sign Out</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer v-model="drawerOpen" show-if-above class="admin-sidebar" :width="280">
      <div class="sidebar-bg"></div>

      <div class="sidebar-content column no-wrap full-height relative-position">
        <!-- Logo -->
        <div class="sidebar-brand q-pa-lg row items-center">
          <div class="brand-icon shadow-glow">
            <q-icon name="restaurant" size="24px" color="white" />
          </div>
          <div class="brand-text q-ml-md">
            <div class="brand-title">SmartDine</div>
            <div class="brand-subtitle">Control Center</div>
          </div>
        </div>

        <!-- Nav Links -->
        <q-scroll-area class="col q-px-md" :thumb-style="{ opacity: 0.2, width: '4px' }">
          <div class="nav-section-title">Overview</div>
          <q-list class="nav-list q-mb-lg">
            <q-item
              v-for="item in mainNavItems"
              :key="item.name"
              clickable
              v-ripple
              :to="item.to"
              exact
              :active="isActive(item)"
              active-class="nav-item--active"
              class="nav-item"
            >
              <q-item-section avatar class="nav-item-icon"
                ><q-icon :name="item.icon" size="22px"
              /></q-item-section>
              <q-item-section class="nav-item-label">{{ item.label }}</q-item-section>
              <q-item-section v-if="item.badge" side>
                <q-badge :color="item.badgeColor || 'orange'" class="nav-badge">{{
                  item.badge
                }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>

          <div class="nav-section-title">Operations</div>
          <q-list class="nav-list q-mb-lg">
            <q-item
              v-for="item in mgmtNavItems"
              :key="item.name"
              clickable
              v-ripple
              :to="item.to"
              exact
              :active="isActive(item)"
              active-class="nav-item--active"
              class="nav-item"
            >
              <q-item-section avatar class="nav-item-icon"
                ><q-icon :name="item.icon" size="22px"
              /></q-item-section>
              <q-item-section class="nav-item-label">{{ item.label }}</q-item-section>
              <q-item-section v-if="item.badge" side>
                <q-badge :color="item.badgeColor || 'red'" class="nav-badge">{{
                  item.badge
                }}</q-badge>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <!-- Footer Info -->
        <div class="sidebar-footer q-pa-md">
          <div class="sys-status row items-center q-mb-md">
            <span class="status-dot"></span> All Systems Operational
          </div>
          <div class="creator-stamp text-center">
            SmartDine OS v2.0 <br />
            <span>Designed by G.Nawod Sanjana</span>
          </div>
        </div>
      </div>
    </q-drawer>

    <!-- Main View -->
    <q-page-container class="page-container-bg">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" v-if="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSmartDineEngine } from 'stores/smartdine-engine'
import { useOrderStore } from 'stores/order-store'
import { useInventoryStore } from 'stores/inventory-store'
import { useAdminAuthStore } from 'stores/admin-auth-store'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const engine = useSmartDineEngine()
const orderStore = useOrderStore()
const inventoryStore = useInventoryStore()
const adminAuth = useAdminAuthStore()
const drawerOpen = ref(false)

// 🔐 AUTH GUARD
onMounted(() => {
  adminAuth.tryAutoRestore()
  if (!adminAuth.isLoggedIn) {
    router.replace({ name: 'admin-login', query: { redirect: route.fullPath } })
  }
})

// --- Notifications ---
const initialNotifs = [
  {
    id: 'n1',
    title: 'Low Stock Alert',
    message: 'Truffle Oil is below minimum (1 L remaining)',
    icon: 'warning',
    color: 'red',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'New Order',
    message: 'ORD-006 placed from VIP Table 7 (4 items)',
    icon: 'receipt_long',
    color: 'green',
    time: '5 min ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Service Delay',
    message: 'ORD-003 pending over 20+ minutes',
    icon: 'timer_off',
    color: 'amber',
    time: '8 min ago',
    read: false,
  },
  {
    id: 'n4',
    title: 'Table Reserved',
    message: 'Table 4 reserved for 8:00 PM (4 guests)',
    icon: 'event_seat',
    color: 'blue',
    time: '20 min ago',
    read: true,
  },
]

const notifications = computed(() => [...engine.notifications, ...initialNotifs])
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAllRead() {
  engine.notifications.forEach((n) => {
    n.read = true
  })
  initialNotifs.forEach((n) => {
    n.read = true
  })
}

function dismissNotif(id) {
  const idx = engine.notifications.findIndex((n) => n.id === id)
  if (idx >= 0) engine.notifications.splice(idx, 1)
  const idx2 = initialNotifs.findIndex((n) => n.id === id)
  if (idx2 >= 0) initialNotifs.splice(idx2, 1)
}

function handleLogout() {
  $q.dialog({
    title: 'Secure Sign Out',
    message: 'Are you sure you want to exit the control center?',
    dark: true,
    class: 'glass-toast',
    cancel: { flat: true, color: 'grey-5', noCaps: true, label: 'Cancel' },
    ok: {
      color: 'red-6',
      rounded: true,
      unelevated: true,
      noCaps: true,
      label: 'Sign Out securely',
    },
  }).onOk(() => {
    adminAuth.logout()
    $q.notify({
      message: 'Session terminated safely.',
      icon: 'lock',
      color: 'dark',
      classes: 'glass-toast border-positive',
      position: 'top',
    })
    router.push({ name: 'admin-login' })
  })
}

// --- Navigation ---
const pendingOrderCount = computed(
  () => orderStore.kdsOrders.filter((o) => ['pending', 'cooking'].includes(o.status)).length,
)
const lowStockCount = computed(() => inventoryStore.lowStockItems.length)

const mainNavItems = computed(() => [
  {
    name: 'dashboard',
    label: 'Dashboard Overview',
    icon: 'dashboard',
    to: { name: 'admin-dashboard' },
  },
  {
    name: 'orders',
    label: 'Order Dispatch',
    icon: 'list_alt',
    to: { name: 'admin-orders' },
    badge: pendingOrderCount.value > 0 ? String(pendingOrderCount.value) : null,
    badgeColor: 'orange',
  },
  {
    name: 'tables',
    label: 'Floor Plan & Tables',
    icon: 'table_restaurant',
    to: { name: 'admin-tables' },
  },
])

const mgmtNavItems = computed(() => [
  { name: 'menu', label: 'Menu Engineering', icon: 'restaurant_menu', to: { name: 'admin-menu' } },
  {
    name: 'inventory',
    label: 'Stock & Inventory',
    icon: 'inventory_2',
    to: { name: 'admin-inventory' },
    badge: lowStockCount.value > 0 ? String(lowStockCount.value) : null,
    badgeColor: 'red',
  },
  {
    name: 'analytics',
    label: 'Insights & Analytics',
    icon: 'insert_chart_outlined',
    to: { name: 'admin-analytics' },
  },
  { name: 'settings', label: 'System Settings', icon: 'settings', to: { name: 'admin-settings' } },
])

function isActive(item) {
  return route.name === item.to?.name
}
</script>

<style lang="scss" scoped>
/* Core Theming */
.premium-admin-layout {
  background-color: #070707;
  color: #e5e5e5;
  font-family: 'Inter', sans-serif;
}

/* Page Container styling */
.page-container-bg {
  background: radial-gradient(circle at top right, rgba(20, 20, 20, 1) 0%, rgba(7, 7, 7, 1) 100%);
  min-height: 100vh;
}

/* Top Navbar */
.admin-topbar {
  background: rgba(7, 7, 7, 0.7) !important;
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.menu-btn {
  color: #a3a3a3 !important;
  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.05);
  }
}
.shadow-soft {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.action-btn {
  color: #8a8a8a !important;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s;
  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
}
.separator-dots {
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background: #333;
  box-shadow:
    12px 0 0 #333,
    -12px 0 0 #333;
  margin: 0 20px;
}

/* Pulse Badge for Notifications */
.pulse-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  border: 2px solid #070707;
  padding: 2px 6px;
  box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  animation: pulseRed 2s infinite;
}
@keyframes pulseRed {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

/* Profile Button Area */
.profile-btn {
  border-radius: 100px;
  padding: 4px;
  transition: background 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}
.hide-on-mobile {
  @media (max-width: 600px) {
    display: none;
  }
}
.profile-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #f5f5f5;
  line-height: 1.2;
}
.profile-role {
  font-size: 0.7rem;
  color: #ea580c;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.profile-avatar {
  border: 2px solid rgba(255, 255, 255, 0.1);
}
.shadow-glow {
  box-shadow: 0 4px 16px rgba(234, 88, 12, 0.4);
}

/* Sidebar Drawer */
.admin-sidebar {
  background: transparent !important;
  border: none !important;
}
.sidebar-bg {
  position: absolute;
  inset: 0;
  background: #111;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 0;
}
.sidebar-content {
  z-index: 1;
  padding: 12px 0;
}

.sidebar-brand {
  margin-bottom: 24px;
}
.brand-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 800;
  font-size: 1.4rem;
  color: #fff;
  line-height: 1.1;
  letter-spacing: -0.5px;
}
.brand-subtitle {
  font-size: 0.75rem;
  color: #737373;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.nav-section-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #525252;
  margin: 0 0 8px 16px;
}
.nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  border-radius: 12px;
  padding: 10px 16px;
  min-height: 48px;
  color: #a3a3a3;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #f5f5f5;
    transform: translateX(4px);
  }
  .nav-item-icon {
    min-width: 40px;
    color: inherit;
    transition: color 0.3s;
  }
  .nav-item-label {
    font-weight: 500;
    font-size: 0.9rem;
    transition: font-weight 0.3s;
  }
  .nav-badge {
    font-weight: 700;
    opacity: 0.9;
  }
}

.nav-item--active {
  background: linear-gradient(90deg, rgba(234, 88, 12, 0.15) 0%, transparent 100%) !important;
  color: #fff !important;
  border-left: 3px solid #ea580c;
  border-radius: 0 12px 12px 0;

  .nav-item-icon {
    color: #ea580c;
  }
  .nav-item-label {
    font-weight: 700;
  }
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at left, rgba(234, 88, 12, 0.2) 0%, transparent 70%);
    pointer-events: none;
  }
}

.sidebar-footer {
  border-top: 1px dashed rgba(255, 255, 255, 0.05);
}
.sys-status {
  font-size: 0.75rem;
  color: #22c55e;
  font-family: monospace;
  font-weight: 600;
  justify-content: center;
  background: rgba(34, 197, 94, 0.1);
  padding: 8px;
  border-radius: 8px;
}
.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
  margin-right: 8px;
  animation: pulseGreen 2s infinite;
}
@keyframes pulseGreen {
  0% {
    opacity: 1;
    box-shadow: 0 0 4px #22c55e;
  }
  50% {
    opacity: 0.4;
    box-shadow: none;
  }
  100% {
    opacity: 1;
    box-shadow: 0 0 4px #22c55e;
  }
}
.creator-stamp {
  font-size: 0.7rem;
  color: #525252;
  font-weight: 500;
  line-height: 1.5;
  span {
    color: #737373;
    font-style: italic;
  }
}

/* Premium Popup Menus (Profile & Notifs) */
:deep(.premium-menu) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 8px;
  overflow: visible !important;

  .menu-glass-bg {
    position: absolute;
    inset: 8px;
    background: rgba(20, 20, 20, 0.85);
    backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    z-index: 0;
  }
  .q-list {
    z-index: 1;
    padding: 16px;
  }
}

.menu-header {
  padding: 0 0 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;
}
.empty-notifs {
  text-align: center;
  padding: 32px 0;
  color: #737373;
  font-size: 0.9rem;
}

.notif-item {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 8px;
  transition: all 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
    .close-btn {
      opacity: 1;
    }
  }
}
.notif-unread {
  border-left: 3px solid #ea580c;
  background: rgba(234, 88, 12, 0.05);
}
.notif-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.notif-title {
  font-weight: 700;
  color: #f5f5f5;
  font-size: 0.85rem;
  line-height: 1.2;
}
.notif-msg {
  font-size: 0.75rem;
  color: #a3a3a3;
  margin-top: 4px;
  line-height: 1.4;
}
.notif-time {
  font-size: 0.65rem;
  color: #525252;
  margin-top: 6px;
  font-weight: 600;
  text-transform: uppercase;
}
.close-btn {
  opacity: 0;
  transition: opacity 0.3s;
  &:hover {
    color: #fff !important;
    background: rgba(255, 255, 255, 0.1);
  }
}

.menu-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 8px 0;
}
.menu-action-item {
  border-radius: 10px;
  color: #d4d4d4;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #fff;
    transform: translateX(4px);
  }
  .q-item__section--avatar {
    min-width: 36px;
    color: #a3a3a3;
  }
}
.logout-item:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
  .q-item__section--avatar {
    color: #ef4444 !important;
  }
}

/* Vue Transitions */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<!-- GLOBAL styles for q-menu portals (rendered outside scoped component tree) -->
<style lang="scss">
/* Premium Popup Menus - GLOBAL (q-menu teleports to body) */
.premium-menu.q-menu {
  background: rgba(18, 18, 18, 0.95) !important;
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 16px !important;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.7),
    0 0 0 1px rgba(255, 255, 255, 0.05) !important;
  overflow: hidden !important;
  padding: 0 !important;
  color: #e5e5e5;

  /* Entrance animation */
  animation: menuSlideIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;

  .menu-glass-bg {
    display: none; /* No longer needed, the q-menu itself is styled */
  }

  .q-list {
    padding: 12px;
    background: transparent;
  }

  .q-item {
    color: #d4d4d4;
    border-radius: 10px;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #fff;
    }
  }

  .q-item__label--header {
    color: #a3a3a3;
  }
}

/* Notification menu specific */
.notif-menu.q-menu {
  min-width: 340px;

  .q-list {
    padding: 16px;
  }
}

/* Profile menu specific */
.profile-menu.q-menu {
  min-width: 240px;

  .q-item__section--avatar {
    min-width: 36px;
  }
}

@keyframes menuSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
