<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
            Orders
          </h4>
          <p class="text-grey-6 q-mb-none">Manage and track all restaurant orders</p>
        </div>
        <div class="row q-gutter-sm">
          <q-btn-toggle
            v-model="statusFilter"
            no-caps
            rounded
            unelevated
            toggle-color="orange-9"
            text-color="grey-5"
            size="sm"
            :options="[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Cooking', value: 'cooking' },
              { label: 'Ready', value: 'ready' },
              { label: 'Served', value: 'served' },
            ]"
          />
        </div>
      </div>

      <q-card dark flat class="glass-card">
        <q-table
          dark
          flat
          :rows="filteredOrders"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 10 }"
          class="admin-table"
        >
          <template v-slot:body-cell-orderId="props">
            <q-td :props="props">
              <span class="text-weight-bold" style="font-family: 'Space Grotesk', monospace">{{
                props.row.id
              }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-table="props">
            <q-td :props="props">
              <q-badge color="grey-8" rounded class="q-pa-sm">
                <q-icon name="table_restaurant" size="12px" class="q-mr-xs" /> Table
                {{ props.row.tableNumber }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-items="props">
            <q-td :props="props">
              <div v-for="item in props.row.items" :key="item.name" style="font-size: 0.8rem">
                {{ item.quantity }}× {{ item.name }}
                <span v-if="item.notes" class="text-amber-5"> — {{ item.notes }}</span>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <span class="status-badge" :class="'status-badge--' + props.row.status">{{
                props.row.status
              }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              <span class="price-tag">Rs. {{ props.row.totalAmount.toLocaleString() }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-time="props">
            <q-td :props="props">
              <span class="text-grey-5" style="font-size: 0.8rem">{{
                formatTime(props.row.createdAt)
              }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn-dropdown flat dense rounded icon="more_vert" size="sm" color="grey-5">
                <q-list dark style="background: #1c1917">
                  <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'cooking')">
                    <q-item-section avatar
                      ><q-icon name="local_fire_department" color="blue" size="xs"
                    /></q-item-section>
                    <q-item-section>Start Cooking</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'ready')">
                    <q-item-section avatar
                      ><q-icon name="check_circle" color="green" size="xs"
                    /></q-item-section>
                    <q-item-section>Mark Ready</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'served')">
                    <q-item-section avatar
                      ><q-icon name="done_all" color="grey" size="xs"
                    /></q-item-section>
                    <q-item-section>Mark Served</q-item-section>
                  </q-item>
                  <q-separator dark />
                  <q-item clickable v-close-popup @click="updateStatus(props.row.id, 'cancelled')">
                    <q-item-section avatar
                      ><q-icon name="cancel" color="red" size="xs"
                    /></q-item-section>
                    <q-item-section class="text-red">Cancel Order</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from 'stores/order-store'
import { useSmartDineEngine } from 'stores/smartdine-engine'

const orderStore = useOrderStore()
const engine = useSmartDineEngine()
const statusFilter = ref('all')

const filteredOrders = computed(() => {
  if (statusFilter.value === 'all') return orderStore.kdsOrders
  return orderStore.kdsOrders.filter((o) => o.status === statusFilter.value)
})

const columns = [
  { name: 'orderId', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'table', label: 'Table', field: 'tableNumber', align: 'left' },
  { name: 'items', label: 'Items', field: 'items', align: 'left', style: 'width: 35%' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'total', label: 'Total', field: 'totalAmount', align: 'right' },
  { name: 'time', label: 'Time', field: 'createdAt', align: 'center' },
  { name: 'actions', label: '', field: 'id', align: 'center' },
]

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function updateStatus(orderId, status) {
  // 🔥 Use ENGINE for cross-module updates
  if (status === 'cooking') engine.startCooking(orderId)
  else if (status === 'ready') engine.markReady(orderId)
  else if (status === 'served') engine.markServed(orderId)
  else orderStore.updateOrderStatus(orderId, status)
}
</script>

<style lang="scss" scoped>
.admin-page {
  background: #0c0a09;
  min-height: 100vh;
}
.admin-table {
  background: transparent;
  :deep(th) {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #78716c;
    border-color: rgba(255, 255, 255, 0.06);
  }
  :deep(td) {
    border-color: rgba(255, 255, 255, 0.04);
  }
}
</style>
