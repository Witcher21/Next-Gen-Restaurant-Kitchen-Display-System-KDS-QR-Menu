<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
        Settings
      </h4>
      <p class="text-grey-6 q-mb-lg">Configure your restaurant and system preferences</p>

      <!-- Restaurant Info -->
      <div class="glass-card q-pa-lg q-mb-lg">
        <h6 class="section-title q-mb-md">🏪 Restaurant Information</h6>
        <div class="row q-gutter-lg">
          <q-input
            v-model="settings.restaurantName"
            dark
            outlined
            dense
            label="Restaurant Name"
            class="col-12 col-md-5"
          />
          <q-input
            v-model="settings.phone"
            dark
            outlined
            dense
            label="Phone"
            class="col-12 col-md-3"
          />
          <q-input
            v-model="settings.email"
            dark
            outlined
            dense
            label="Email"
            class="col-12 col-md-3"
          />
        </div>
        <q-input v-model="settings.address" dark outlined dense label="Address" class="q-mt-md" />
      </div>

      <!-- Service Settings -->
      <div class="glass-card q-pa-lg q-mb-lg">
        <h6 class="section-title q-mb-md">⚙️ Service Configuration</h6>
        <div class="row q-gutter-lg">
          <q-input
            v-model.number="settings.serviceFeePercent"
            dark
            outlined
            dense
            label="Service Fee (%)"
            type="number"
            class="col-12 col-md-3"
          />
          <q-input
            v-model.number="settings.taxPercent"
            dark
            outlined
            dense
            label="Tax (%)"
            type="number"
            class="col-12 col-md-3"
          />
          <q-input
            v-model.number="settings.totalTables"
            dark
            outlined
            dense
            label="Total Tables"
            type="number"
            class="col-12 col-md-3"
          />
        </div>

        <q-separator dark class="q-my-lg" style="background: rgba(255, 255, 255, 0.06)" />

        <div class="q-gutter-md">
          <q-toggle
            v-model="settings.autoAcceptOrders"
            dark
            color="orange"
            label="Auto-accept incoming orders"
          />
          <q-toggle
            v-model="settings.enableSoundAlerts"
            dark
            color="orange"
            label="Enable KDS sound alerts"
          />
          <q-toggle
            v-model="settings.showPrepTime"
            dark
            color="orange"
            label="Show estimated prep time to customers"
          />
          <q-toggle
            v-model="settings.enableInventorySync"
            dark
            color="orange"
            label="Auto-deduct inventory on order"
          />
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="glass-card q-pa-lg q-mb-lg">
        <h6 class="section-title q-mb-md">🔔 Notifications</h6>
        <div class="q-gutter-md">
          <q-toggle v-model="settings.notifyLowStock" dark color="red" label="Low stock alerts" />
          <q-toggle
            v-model="settings.notifyNewOrder"
            dark
            color="green"
            label="New order notifications (Admin)"
          />
          <q-toggle
            v-model="settings.notifyOrderDelay"
            dark
            color="amber"
            label="Order delay warnings (> 15 min)"
          />
        </div>
      </div>

      <!-- Save -->
      <div class="row justify-end q-mt-lg">
        <q-btn flat no-caps color="grey-5" label="Reset Defaults" class="q-mr-md" />
        <q-btn rounded unelevated no-caps color="orange-9" icon="save" label="Save Changes" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const settings = ref({
  restaurantName: 'SmartDine Restaurant',
  phone: '+94 77 123 4567',
  email: 'admin@smartdine.lk',
  address: '42 Galle Road, Colombo 03, Sri Lanka',
  serviceFeePercent: 10,
  taxPercent: 0,
  totalTables: 15,
  autoAcceptOrders: true,
  enableSoundAlerts: true,
  showPrepTime: true,
  enableInventorySync: true,
  notifyLowStock: true,
  notifyNewOrder: true,
  notifyOrderDelay: true,
})
</script>

<style lang="scss" scoped>
.admin-page {
  background: #0c0a09;
  min-height: 100vh;
}
</style>
