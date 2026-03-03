<template>
  <q-page class="admin-page">
    <div class="page-padding">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h4 class="q-mb-xs text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
            Inventory
          </h4>
          <p class="text-grey-6 q-mb-none">
            Track raw materials and stock levels ({{ inventoryStore.ingredients.length }} items)
          </p>
        </div>
        <q-btn
          rounded
          unelevated
          color="orange-9"
          no-caps
          icon="add"
          label="Add Item"
          @click="openAddDialog"
        />
      </div>

      <!-- Low Stock Alerts -->
      <div v-if="inventoryStore.lowStockItems.length > 0" class="q-mb-lg">
        <q-banner dark rounded class="low-stock-banner">
          <template v-slot:avatar><q-icon name="warning" color="amber" /></template>
          <strong>{{ inventoryStore.lowStockItems.length }} items are running low!</strong>
          <span class="text-grey-5 q-ml-sm">{{
            inventoryStore.lowStockItems.map((i) => i.name).join(', ')
          }}</span>
        </q-banner>
      </div>

      <!-- Recent Deductions Log -->
      <div v-if="inventoryStore.deductionLog.length > 0" class="q-mb-lg">
        <q-expansion-item
          dark
          icon="history"
          label="Recent Stock Deductions"
          caption="Auto-deducted by order engine"
          header-class="text-grey-4"
          class="glass-card"
        >
          <q-list dark dense separator>
            <q-item
              v-for="(log, i) in inventoryStore.deductionLog.slice(0, 5)"
              :key="i"
              class="text-grey-5"
              style="font-size: 0.8rem"
            >
              <q-item-section avatar
                ><q-icon name="restaurant" color="orange" size="16px"
              /></q-item-section>
              <q-item-section>
                <q-item-label>{{ log.quantity }}× {{ log.itemName }}</q-item-label>
                <q-item-label caption>
                  {{
                    log.deductions
                      .map((d) => `${d.ingredient}: -${d.deducted} ${d.unit}`)
                      .join(' | ')
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>

      <!-- Inventory Table -->
      <q-card dark flat class="glass-card">
        <q-table
          dark
          flat
          :rows="inventoryStore.ingredients"
          :columns="columns"
          row-key="id"
          :pagination="{ rowsPerPage: 15 }"
          class="admin-table"
        >
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <div class="row items-center no-wrap">
                <q-icon
                  name="inventory_2"
                  size="20px"
                  :color="props.row.stock <= props.row.minAlert ? 'red' : 'green'"
                  class="q-mr-sm"
                />
                <div>
                  <span class="text-weight-bold">{{ props.row.name }}</span>
                  <div class="text-grey-7" style="font-size: 0.7rem">{{ props.row.category }}</div>
                </div>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-stock="props">
            <q-td :props="props">
              <div class="row items-center no-wrap q-gutter-sm">
                <q-linear-progress
                  :value="props.row.stock / props.row.maxStock"
                  :color="
                    props.row.stock <= props.row.minAlert
                      ? 'red'
                      : props.row.stock <= props.row.minAlert * 2
                        ? 'amber'
                        : 'green'
                  "
                  rounded
                  style="width: 80px; height: 8px"
                />
                <span
                  class="text-weight-bold"
                  :class="
                    props.row.stock <= props.row.minAlert
                      ? 'text-red'
                      : props.row.stock === 0
                        ? 'text-red-10'
                        : ''
                  "
                >
                  {{ props.row.stock }} {{ props.row.unit }}
                </span>
                <span class="text-grey-7" style="font-size: 0.7rem"
                  >/ {{ props.row.maxStock }}</span
                >
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge
                :color="
                  props.row.stock === 0
                    ? 'red-10'
                    : props.row.stock <= props.row.minAlert
                      ? 'red'
                      : props.row.stock <= props.row.minAlert * 2
                        ? 'amber'
                        : 'green'
                "
                rounded
              >
                {{
                  props.row.stock === 0
                    ? 'OUT OF STOCK'
                    : props.row.stock <= props.row.minAlert
                      ? 'Low Stock'
                      : props.row.stock <= props.row.minAlert * 2
                        ? 'Warning'
                        : 'In Stock'
                }}
              </q-badge>
            </q-td>
          </template>
          <template v-slot:body-cell-lastRestocked="props">
            <q-td :props="props">
              <span class="text-grey-5" style="font-size: 0.8rem">{{
                props.row.lastRestocked
              }}</span>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                dense
                rounded
                no-caps
                size="sm"
                color="green"
                icon="add"
                label="Restock"
                @click="openRestockDialog(props.row)"
              />
              <q-btn
                flat
                round
                dense
                icon="delete"
                size="sm"
                color="red-4"
                class="q-ml-xs"
                @click="confirmDelete(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card>

      <!-- Restock Dialog -->
      <q-dialog v-model="restockDialog" persistent>
        <q-card dark class="glass-card" style="min-width: 420px">
          <q-card-section>
            <div class="text-h6 text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
              Restock: {{ restockTarget?.name }}
            </div>
            <div class="text-grey-6 q-mt-xs" style="font-size: 0.85rem">
              Current stock:
              <strong
                :class="restockTarget?.stock <= restockTarget?.minAlert ? 'text-red' : 'text-green'"
                >{{ restockTarget?.stock }} {{ restockTarget?.unit }}</strong
              >
              &nbsp;/&nbsp; Max: {{ restockTarget?.maxStock }} {{ restockTarget?.unit }}
            </div>
          </q-card-section>
          <q-separator dark style="background: rgba(255, 255, 255, 0.06)" />
          <q-card-section class="q-pt-lg">
            <p class="text-grey-5 q-mb-md" style="font-size: 0.85rem">
              How much do you want to add?
            </p>
            <div class="row q-gutter-sm q-mb-lg">
              <q-btn
                v-for="qty in [5, 10, 20, 50]"
                :key="qty"
                rounded
                outline
                no-caps
                dense
                :color="restockQty === qty ? 'orange' : 'grey-6'"
                :label="`+${qty}`"
                @click="restockQty = qty"
                class="quick-btn"
              />
              <q-btn
                rounded
                outline
                no-caps
                dense
                :color="restockQty === fillAmount ? 'orange' : 'grey-6'"
                label="Fill Max"
                @click="restockQty = fillAmount"
                class="quick-btn"
              />
            </div>
            <q-input
              v-model.number="restockQty"
              dark
              outlined
              dense
              label="Custom Quantity"
              type="number"
              :suffix="restockTarget?.unit"
            />
            <div class="restock-preview q-mt-md q-pa-md" v-if="restockQty > 0">
              <div class="row justify-between items-center">
                <span class="text-grey-5">After restock:</span>
                <span
                  class="text-weight-bold text-green"
                  style="font-family: 'Space Grotesk', monospace; font-size: 1.1rem"
                >
                  {{
                    Math.min(
                      (restockTarget?.stock || 0) + restockQty,
                      restockTarget?.maxStock || 100,
                    )
                  }}
                  {{ restockTarget?.unit }}
                </span>
              </div>
              <q-linear-progress
                :value="
                  Math.min(
                    (restockTarget?.stock || 0) + restockQty,
                    restockTarget?.maxStock || 100,
                  ) / (restockTarget?.maxStock || 100)
                "
                color="green"
                rounded
                class="q-mt-sm"
                style="height: 8px"
              />
            </div>
          </q-card-section>
          <q-card-actions align="right" class="q-px-lg q-pb-lg">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="restockDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              label="Confirm Restock"
              color="green"
              icon="check"
              :disable="!restockQty || restockQty <= 0"
              @click="doRestock"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Add Dialog -->
      <q-dialog v-model="addDialog" persistent>
        <q-card dark class="glass-card" style="min-width: 450px">
          <q-card-section>
            <div class="text-h6 text-weight-bold" style="font-family: 'Space Grotesk', sans-serif">
              Add Ingredient
            </div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input v-model="newIngredient.name" dark outlined dense label="Name *" />
            <div class="row q-gutter-md">
              <q-input
                v-model.number="newIngredient.stock"
                dark
                outlined
                dense
                label="Initial Stock"
                type="number"
                class="col"
              />
              <q-input
                v-model.number="newIngredient.maxStock"
                dark
                outlined
                dense
                label="Max Capacity"
                type="number"
                class="col"
              />
            </div>
            <div class="row q-gutter-md">
              <q-select
                v-model="newIngredient.unit"
                dark
                outlined
                dense
                label="Unit"
                :options="['kg', 'g', 'l', 'ml', 'pcs']"
                class="col"
              />
              <q-input
                v-model.number="newIngredient.minAlert"
                dark
                outlined
                dense
                label="Low Stock Alert"
                type="number"
                class="col"
              />
            </div>
            <q-input v-model="newIngredient.category" dark outlined dense label="Category" />
          </q-card-section>
          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="addDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              label="Add"
              color="orange-9"
              icon="add"
              @click="doAdd"
              :disable="!newIngredient.name"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Dialog -->
      <q-dialog v-model="deleteDialog">
        <q-card dark class="glass-card" style="min-width: 380px">
          <q-card-section
            ><div class="text-h6 text-weight-bold">
              Remove {{ deleteTarget?.name }}?
            </div></q-card-section
          >
          <q-card-actions align="right" class="q-px-md q-pb-md">
            <q-btn flat no-caps label="Cancel" color="grey-5" @click="deleteDialog = false" />
            <q-btn
              rounded
              unelevated
              no-caps
              label="Remove"
              color="red"
              icon="delete"
              @click="doDelete"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useInventoryStore } from 'stores/inventory-store'

const $q = useQuasar()
const inventoryStore = useInventoryStore()

const restockDialog = ref(false)
const addDialog = ref(false)
const deleteDialog = ref(false)
const restockTarget = ref(null)
const deleteTarget = ref(null)
const restockQty = ref(0)
const newIngredient = ref({
  name: '',
  stock: 0,
  maxStock: 50,
  unit: 'kg',
  minAlert: 10,
  category: 'General',
})
const fillAmount = computed(() =>
  restockTarget.value ? restockTarget.value.maxStock - restockTarget.value.stock : 0,
)

const columns = [
  { name: 'name', label: 'Ingredient', field: 'name', align: 'left', style: 'width: 25%' },
  { name: 'stock', label: 'Stock Level', field: 'stock', align: 'left' },
  { name: 'status', label: 'Status', field: 'stock', align: 'center' },
  { name: 'lastRestocked', label: 'Last Restocked', field: 'lastRestocked', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'name', align: 'center' },
]

function openRestockDialog(item) {
  restockTarget.value = item
  restockQty.value = 0
  restockDialog.value = true
}

function doRestock() {
  if (restockTarget.value && restockQty.value > 0) {
    inventoryStore.restock(restockTarget.value.id, restockQty.value)
    $q.notify({
      type: 'positive',
      message: `Restocked ${restockQty.value} ${restockTarget.value.unit} of ${restockTarget.value.name}`,
      icon: 'inventory_2',
      position: 'top',
    })
    restockDialog.value = false
  }
}

function openAddDialog() {
  newIngredient.value = {
    name: '',
    stock: 0,
    maxStock: 50,
    unit: 'kg',
    minAlert: 10,
    category: 'General',
  }
  addDialog.value = true
}

function doAdd() {
  if (!newIngredient.value.name) return
  inventoryStore.addIngredient({ ...newIngredient.value, lastRestocked: 'Just added' })
  $q.notify({
    type: 'positive',
    message: `"${newIngredient.value.name}" added to inventory`,
    icon: 'add_circle',
    position: 'top',
  })
  addDialog.value = false
}

function confirmDelete(item) {
  deleteTarget.value = item
  deleteDialog.value = true
}

function doDelete() {
  if (deleteTarget.value) {
    inventoryStore.removeIngredient(deleteTarget.value.id)
    $q.notify({
      type: 'negative',
      message: `"${deleteTarget.value.name}" removed`,
      icon: 'delete',
      position: 'top',
    })
    deleteDialog.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-page {
  background: #0c0a09;
  min-height: 100vh;
}
.low-stock-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
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
.quick-btn {
  min-width: 60px;
}
.restock-preview {
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 12px;
}
</style>
