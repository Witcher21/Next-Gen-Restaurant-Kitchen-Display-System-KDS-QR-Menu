<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
            Tables
          </h4>
          <p class="text-grey-6 q-mb-none">
            {{ tableStore.occupiedTables.length }} occupied / {{ tableStore.tables.length }} total
            <span v-if="tableStore.activeSessions.length" class="text-blue q-ml-sm">
              • {{ tableStore.activeSessions.length }} active sessions
            </span>
          </p>
        </div>
        <q-btn
          rounded
          unelevated
          color="orange-9"
          no-caps
          icon="add"
          label="Add Table"
          @click="openAddDialog"
        />
      </div>

      <!-- Status Legend -->
      <div class="row q-gutter-md q-mb-lg">
        <div
          v-for="(config, key) in tableStore.statusConfig"
          :key="key"
          class="row items-center no-wrap"
        >
          <q-badge
            :color="config.color"
            rounded
            class="q-mr-xs"
            style="width: 10px; height: 10px"
          />
          <span class="text-grey-5" style="font-size: 0.75rem">{{ config.label }}</span>
        </div>
      </div>

      <!-- Table Grid -->
      <div class="table-grid">
        <div
          v-for="table in tableStore.tables"
          :key="table.number"
          class="table-card glass-card"
          :class="'table-card--' + table.status"
        >
          <div class="table-card__header">
            <span class="table-number">{{ table.number }}</span>
            <q-badge :color="tableStore.statusConfig[table.status]?.color || 'grey'" rounded>
              {{ tableStore.statusConfig[table.status]?.label || table.status }}
            </q-badge>
          </div>
          <div class="table-card__body">
            <div class="row items-center q-gutter-xs text-grey-6" style="font-size: 0.8rem">
              <q-icon name="people" size="14px" /> {{ table.capacity }} seats
            </div>
            <div
              v-if="table.currentOrder"
              class="text-orange q-mt-xs"
              style="font-size: 0.8rem; font-family: 'Space Grotesk', monospace"
            >
              {{ table.currentOrder }}
            </div>
            <div v-if="table.scannedAt" class="text-blue-4 q-mt-xs" style="font-size: 0.7rem">
              Scanned {{ formatTime(table.scannedAt) }}
            </div>
          </div>
          <div class="table-card__actions q-mt-sm">
            <q-btn-dropdown
              flat
              dense
              rounded
              no-caps
              size="sm"
              color="grey-5"
              label="Actions"
              icon="more_vert"
            >
              <q-list dark dense style="min-width: 160px; background: #1c1917">
                <q-item
                  v-if="table.status !== 'available'"
                  clickable
                  v-close-popup
                  @click="tableStore.setStatus(table.number, 'available')"
                >
                  <q-item-section avatar
                    ><q-icon name="check_circle" color="green" size="16px"
                  /></q-item-section>
                  <q-item-section
                    ><q-item-label style="font-size: 0.8rem"
                      >Set Available</q-item-label
                    ></q-item-section
                  >
                </q-item>
                <q-item
                  v-if="table.status === 'available'"
                  clickable
                  v-close-popup
                  @click="tableStore.setStatus(table.number, 'reserved')"
                >
                  <q-item-section avatar
                    ><q-icon name="event_seat" color="purple" size="16px"
                  /></q-item-section>
                  <q-item-section
                    ><q-item-label style="font-size: 0.8rem">Reserve</q-item-label></q-item-section
                  >
                </q-item>
                <q-item clickable v-close-popup @click="simulateScan(table.number)">
                  <q-item-section avatar
                    ><q-icon name="qr_code_scanner" color="blue" size="16px"
                  /></q-item-section>
                  <q-item-section
                    ><q-item-label style="font-size: 0.8rem"
                      >Simulate QR Scan</q-item-label
                    ></q-item-section
                  >
                </q-item>
                <q-item
                  v-if="table.status === 'dining'"
                  clickable
                  v-close-popup
                  @click="tableStore.orderServed(table.number)"
                >
                  <q-item-section avatar
                    ><q-icon name="cleaning_services" color="grey" size="16px"
                  /></q-item-section>
                  <q-item-section
                    ><q-item-label style="font-size: 0.8rem"
                      >Clear Table</q-item-label
                    ></q-item-section
                  >
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </div>

      <!-- Add Table Dialog -->
      <q-dialog v-model="addDialog" persistent>
        <q-card dark class="glass-card" style="min-width: 400px">
          <q-card-section>
            <div class="text-h6 text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
              Add New Table
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              v-model.number="newTable.number"
              dark
              outlined
              dense
              label="Table Number *"
              type="number"
            />
            <q-input
              v-model.number="newTable.capacity"
              dark
              outlined
              dense
              label="Seat Capacity *"
              type="number"
            />
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="addDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              label="Add Table"
              color="orange-9"
              icon="add"
              @click="doAddTable"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useTableStore } from 'stores/table-store'
import { useSmartDineEngine } from 'stores/smartdine-engine'

const $q = useQuasar()
const tableStore = useTableStore()
const engine = useSmartDineEngine()

const addDialog = ref(false)
const newTable = ref({ number: 13, capacity: 4 })

function openAddDialog() {
  newTable.value = { number: tableStore.tables.length + 1, capacity: 4 }
  addDialog.value = true
}

function doAddTable() {
  tableStore.addTable(newTable.value)
  $q.notify({
    type: 'positive',
    message: `Table ${newTable.value.number} added`,
    icon: 'table_restaurant',
    position: 'top',
  })
  addDialog.value = false
}

function simulateScan(tableNumber) {
  const result = engine.scanTable(tableNumber)
  if (result) {
    $q.notify({
      type: 'info',
      message: `📱 QR Scan simulated! Table ${tableNumber} → Browsing Menu`,
      caption: `Session: ${result.sessionId}`,
      position: 'top',
      timeout: 3000,
    })
  }
}

function formatTime(date) {
  if (!date) return ''
  const mins = Math.round((Date.now() - new Date(date).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  return `${Math.floor(mins / 60)}h ago`
}
</script>

<style lang="scss" scoped>
.admin-page {
  background: #0c0a09;
  min-height: 100vh;
}
.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
.table-card {
  padding: 16px;
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
  &--available {
    border-left-color: #22c55e;
  }
  &--browsing {
    border-left-color: #3b82f6;
  }
  &--occupied {
    border-left-color: #f59e0b;
  }
  &--waiting {
    border-left-color: #eab308;
  }
  &--cooking {
    border-left-color: #ea580c;
  }
  &--dining {
    border-left-color: #14b8a6;
  }
  &--reserved {
    border-left-color: #8b5cf6;
  }
  &--cleaning {
    border-left-color: #78716c;
  }
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
}
.table-number {
  font-family: 'Space Grotesk', monospace;
  font-weight: 800;
  font-size: 1.3rem;
  color: #fafaf9;
}
</style>
