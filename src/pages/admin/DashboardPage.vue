<template>
  <q-page class="dashboard-page">
    <div class="page-padding">
      <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
        Dashboard
      </h4>
      <p class="text-grey-6 q-mb-lg">Welcome back! Here's what's happening today.</p>

      <!-- Stats Grid -->
      <div class="stats-grid q-mb-xl">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="stat-card glass-card animate-fade-in-up"
          :class="'stagger-' + (i + 1)"
        >
          <div class="stat-card__icon" :style="{ background: stat.iconBg }">
            <q-icon :name="stat.icon" size="24px" :color="stat.iconColor" />
          </div>
          <div class="stat-card__value">{{ stat.value }}</div>
          <div class="stat-card__label">{{ stat.label }}</div>
          <div class="stat-card__trend" :class="stat.trend > 0 ? 'text-green' : 'text-red'">
            <q-icon :name="stat.trend > 0 ? 'trending_up' : 'trending_down'" size="14px" />
            {{ Math.abs(stat.trend) }}% vs yesterday
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="row items-center justify-between q-mb-md">
        <h6 class="section-title q-mb-none">📋 Recent Orders</h6>
        <q-btn
          flat
          rounded
          no-caps
          dense
          color="orange"
          label="View All →"
          size="sm"
          :to="{ name: 'admin-orders' }"
        />
      </div>
      <q-card dark flat class="glass-card q-mb-xl">
        <q-list separator dark>
          <q-item
            v-for="order in recentOrders"
            :key="order.id"
            class="q-py-md"
            clickable
            v-ripple
            :to="{ name: 'admin-orders' }"
          >
            <q-item-section side>
              <span
                class="text-weight-bold"
                style="font-family: 'Space Grotesk', monospace; font-size: 0.85rem"
                >{{ order.id }}</span
              >
            </q-item-section>
            <q-item-section>
              <q-item-label>Table {{ order.tableNumber }}</q-item-label>
              <q-item-label caption>{{ order.items.length }} items</q-item-label>
            </q-item-section>
            <q-item-section side>
              <span class="status-badge" :class="'status-badge--' + order.status">{{
                order.status
              }}</span>
            </q-item-section>
            <q-item-section side>
              <span class="price-tag">Rs. {{ order.totalAmount.toLocaleString() }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Popular Items -->
      <h6 class="section-title q-mb-md">🔥 Top Selling Items</h6>
      <div class="popular-grid">
        <div
          v-for="(item, i) in topItems"
          :key="item.name"
          class="top-item glass-card animate-fade-in-up"
          :class="'stagger-' + (i + 1)"
        >
          <span class="top-item__rank">#{{ i + 1 }}</span>
          <span class="top-item__emoji">{{ item.emoji }}</span>
          <div class="top-item__info">
            <div class="text-weight-bold" style="font-size: 0.85rem">{{ item.name }}</div>
            <div class="text-grey-6" style="font-size: 0.75rem">{{ item.sold }} sold today</div>
          </div>
          <span class="price-tag">Rs. {{ item.revenue.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useAnalyticsStore } from 'stores/analytics-store'
import { useTableStore } from 'stores/table-store'
import { useMenuStore } from 'stores/menu-store'

const orderStore = useOrderStore()
const analytics = useAnalyticsStore()
const tableStore = useTableStore()
const menuStore = useMenuStore()

const stats = computed(() => [
  {
    label: 'Total Orders',
    value: String(analytics.totalOrdersToday),
    icon: 'receipt_long',
    iconBg: 'rgba(234,88,12,0.15)',
    iconColor: 'orange',
    trend: 12,
  },
  {
    label: 'Revenue',
    value: `Rs. ${analytics.totalRevenueToday.toLocaleString()}`,
    icon: 'payments',
    iconBg: 'rgba(34,197,94,0.15)',
    iconColor: 'green',
    trend: 8,
  },
  {
    label: 'Avg. Prep Time',
    value: `${analytics.avgPrepTime} min`,
    icon: 'timer',
    iconBg: 'rgba(59,130,246,0.15)',
    iconColor: 'blue',
    trend: -5,
  },
  {
    label: 'Active Tables',
    value: `${tableStore.occupiedTables.length}/${tableStore.tables.length}`,
    icon: 'table_restaurant',
    iconBg: 'rgba(245,158,11,0.15)',
    iconColor: 'amber',
    trend: 3,
  },
])

const recentOrders = computed(() => orderStore.kdsOrders.slice(0, 5))

// Live top items from analytics store
const topItems = computed(() => {
  return analytics.topItems.map((item) => {
    const menuItem = menuStore.menuItems.find((m) => m.name === item.name)
    return {
      name: item.name,
      emoji: menuItem?.emoji || '🍽️',
      sold: item.sold,
      revenue: item.revenue,
    }
  })
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  background: #0c0a09;
  min-height: 100vh;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  padding: 20px;
  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }
  &__value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    color: #fafaf9;
  }
  &__label {
    font-size: 0.8rem;
    color: #78716c;
    font-weight: 500;
    margin-top: 4px;
  }
  &__trend {
    font-size: 0.7rem;
    font-weight: 600;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.popular-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.top-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  &__rank {
    font-family: 'Space Grotesk', monospace;
    font-weight: 800;
    font-size: 1rem;
    color: #ea580c;
    min-width: 28px;
  }
  &__emoji {
    font-size: 32px;
  }
  &__info {
    flex: 1;
  }
}
</style>
