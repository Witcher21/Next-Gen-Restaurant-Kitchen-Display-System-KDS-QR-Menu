<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
        Analytics
      </h4>
      <p class="text-grey-6 q-mb-lg">Sales performance and business insights</p>

      <!-- Period Selector -->
      <q-btn-toggle
        v-model="period"
        no-caps
        rounded
        unelevated
        toggle-color="orange-9"
        text-color="grey-5"
        size="sm"
        class="q-mb-lg"
        :options="[
          { label: 'Today', value: 'today' },
          { label: 'This Week', value: 'week' },
          { label: 'This Month', value: 'month' },
        ]"
      />

      <!-- KPI Cards -->
      <div class="stats-grid q-mb-xl">
        <div
          v-for="(stat, i) in stats"
          :key="stat.label"
          class="stat-card glass-card animate-fade-in-up"
          :class="'stagger-' + (i + 1)"
        >
          <div class="stat-card__icon" :style="{ background: stat.bg }">
            <q-icon :name="stat.icon" size="24px" :color="stat.color" />
          </div>
          <div class="stat-card__value">{{ stat.value }}</div>
          <div class="stat-card__label">{{ stat.label }}</div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="row q-gutter-lg q-mb-xl">
        <!-- Hourly Orders -->
        <div class="col-12 col-md-7">
          <div class="glass-card q-pa-lg">
            <h6 class="section-title q-mb-md">📊 Orders by Hour</h6>
            <div class="chart-bars">
              <div v-for="h in hourlyData" :key="h.hour" class="chart-bar-col">
                <div
                  class="chart-bar"
                  :style="{
                    height: (h.orders / maxOrders) * 120 + 'px',
                    background:
                      h.orders > 0
                        ? 'linear-gradient(to top, #EA580C, #F59E0B)'
                        : 'rgba(255,255,255,0.05)',
                  }"
                ></div>
                <span class="chart-label">{{ h.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Category Sales -->
        <div class="col-12 col-md">
          <div class="glass-card q-pa-lg" style="height: 100%">
            <h6 class="section-title q-mb-md">🍽️ Sales by Category</h6>
            <div v-for="cat in categorySales" :key="cat.name" class="category-row q-mb-md">
              <div class="row items-center justify-between q-mb-xs">
                <span class="text-grey-4" style="font-size: 0.85rem"
                  >{{ cat.icon }} {{ cat.name }}</span
                >
                <span class="price-tag" style="font-size: 0.8rem"
                  >Rs. {{ cat.revenue.toLocaleString() }}</span
                >
              </div>
              <q-linear-progress
                :value="cat.revenue / maxCatRevenue"
                rounded
                :color="cat.color"
                style="height: 6px"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Top Items -->
      <div class="glass-card q-pa-lg">
        <h6 class="section-title q-mb-md">🏆 Top Selling Items</h6>
        <q-list dark separator>
          <q-item v-for="(item, i) in topItems" :key="item.name" class="q-py-md">
            <q-item-section side>
              <span
                class="text-weight-bold"
                :class="i < 3 ? 'text-amber' : 'text-grey-6'"
                style="font-family: 'Space Grotesk', monospace; font-size: 1.1rem; min-width: 28px"
              >
                #{{ i + 1 }}
              </span>
            </q-item-section>
            <q-item-section avatar>
              <span style="font-size: 28px">{{ item.emoji }}</span>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-bold">{{ item.name }}</q-item-label>
              <q-item-label caption>{{ item.sold }} sold</q-item-label>
            </q-item-section>
            <q-item-section side>
              <span class="price-tag">Rs. {{ item.revenue.toLocaleString() }}</span>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const period = ref('today')

const stats = [
  {
    label: 'Total Orders',
    value: '47',
    icon: 'receipt_long',
    bg: 'rgba(234,88,12,0.15)',
    color: 'orange',
  },
  {
    label: 'Revenue',
    value: 'Rs. 68,450',
    icon: 'payments',
    bg: 'rgba(34,197,94,0.15)',
    color: 'green',
  },
  {
    label: 'Avg. Order Value',
    value: 'Rs. 1,456',
    icon: 'trending_up',
    bg: 'rgba(59,130,246,0.15)',
    color: 'blue',
  },
  {
    label: 'Peak Hour',
    value: '7 PM',
    icon: 'schedule',
    bg: 'rgba(245,158,11,0.15)',
    color: 'amber',
  },
]

const hourlyData = [
  { hour: 10, label: '10', orders: 2 },
  { hour: 11, label: '11', orders: 5 },
  { hour: 12, label: '12', orders: 12 },
  { hour: 13, label: '1P', orders: 15 },
  { hour: 14, label: '2P', orders: 8 },
  { hour: 15, label: '3P', orders: 4 },
  { hour: 16, label: '4P', orders: 3 },
  { hour: 17, label: '5P', orders: 6 },
  { hour: 18, label: '6P', orders: 14 },
  { hour: 19, label: '7P', orders: 18 },
  { hour: 20, label: '8P', orders: 16 },
  { hour: 21, label: '9P', orders: 10 },
]

const maxOrders = computed(() => Math.max(...hourlyData.map((h) => h.orders)))

const categorySales = [
  { name: 'Kottu & Roti', icon: '🥘', revenue: 18500, color: 'orange' },
  { name: 'Rice & Curry', icon: '🍛', revenue: 15200, color: 'amber' },
  { name: 'Burgers', icon: '🍔', revenue: 12800, color: 'red' },
  { name: 'Beverages', icon: '🥤', revenue: 10500, color: 'green' },
  { name: 'Seafood', icon: '🦐', revenue: 8900, color: 'blue' },
  { name: 'Desserts', icon: '🍰', revenue: 5200, color: 'pink' },
]

const maxCatRevenue = computed(() => Math.max(...categorySales.map((c) => c.revenue)))

const topItems = [
  { name: 'Chicken Kottu', emoji: '🥘', sold: 23, revenue: 19550 },
  { name: 'Classic Cheese Burger', emoji: '🍔', sold: 18, revenue: 14040 },
  { name: 'Chicken Biryani', emoji: '🍚', sold: 15, revenue: 14250 },
  { name: 'Fresh Lime Juice', emoji: '🍋', sold: 31, revenue: 10850 },
  { name: 'Chocolate Lava Cake', emoji: '🍫', sold: 12, revenue: 8160 },
  { name: 'Creamy Carbonara', emoji: '🍝', sold: 10, revenue: 9800 },
  { name: 'Garlic Butter Prawns', emoji: '🦐', sold: 8, revenue: 10240 },
]
</script>

<style lang="scss" scoped>
.admin-page {
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
    margin-bottom: 12px;
  }
  &__value {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #fafaf9;
  }
  &__label {
    font-size: 0.75rem;
    color: #78716c;
    font-weight: 500;
    margin-top: 4px;
  }
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 140px;
}
.chart-bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.chart-bar {
  width: 100%;
  min-height: 4px;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
}
.chart-label {
  font-size: 0.65rem;
  color: #78716c;
  margin-top: 6px;
}

.category-row {
}
</style>
